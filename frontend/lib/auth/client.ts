"use client"

/**
 * Client-side auth helpers around Firebase Auth + the SevaSetu session API.
 *
 * Flow:
 *   1. Sign in / sign up with the Firebase JS SDK (in the browser).
 *   2. Grab the resulting ID token.
 *   3. POST it to /api/auth/session (or /api/auth/signup), which uses the
 *      Firebase Admin SDK on the server to mint an httpOnly session cookie
 *      and a `role` cookie that proxy.ts can read.
 *
 * Returns plain { ok, error } objects so callers can render UI errors easily
 * instead of try/catch-ing throw'd Firebase errors.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type Auth,
} from "firebase/auth"
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client"

export type Role = "volunteer" | "ngo"

export type AuthResult =
  | { ok: true; role: Role; uid: string }
  | { ok: false; error: string }

function ensureAuth(): { auth: Auth } | { error: string } {
  if (!isFirebaseConfigured()) {
    return {
      error:
        "Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* env vars in Vercel and redeploy.",
    }
  }
  const auth = getFirebaseAuth()
  if (!auth) return { error: "Failed to initialise Firebase Auth." }
  return { auth }
}

function friendlyError(code: string | undefined, fallback: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "That email address is invalid."
    case "auth/user-disabled":
      return "This account has been disabled."
    case "auth/user-not-found":
      return "No account found with that email."
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password."
    case "auth/email-already-in-use":
      return "An account already exists with that email."
    case "auth/weak-password":
      return "Password is too weak. Use at least 8 characters with a number."
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a minute and try again."
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again."
    default:
      return fallback
  }
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  const ready = ensureAuth()
  if ("error" in ready) return { ok: false, error: ready.error }

  try {
    const cred = await signInWithEmailAndPassword(ready.auth, email, password)
    const idToken = await cred.user.getIdToken(true)

    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
    })
    const json = (await res.json().catch(() => ({}))) as {
      ok?: boolean
      role?: Role
      error?: string
    }

    if (!res.ok || !json.ok || !json.role) {
      return {
        ok: false,
        error: json.error || "Sign in succeeded but the server could not start a session.",
      }
    }
    return { ok: true, role: json.role, uid: cred.user.uid }
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code
    return {
      ok: false,
      error: friendlyError(code, "Sign in failed. Please try again."),
    }
  }
}

export type SignupInput = {
  email: string
  password: string
  role: Role
  displayName: string
  /** Extra profile fields persisted to Firestore (volunteer/NGO collection). */
  profile?: Record<string, unknown>
}

export async function signUpWithEmail(input: SignupInput): Promise<AuthResult> {
  const ready = ensureAuth()
  if ("error" in ready) return { ok: false, error: ready.error }

  try {
    const cred = await createUserWithEmailAndPassword(
      ready.auth,
      input.email,
      input.password,
    )
    if (input.displayName) {
      await updateProfile(cred.user, { displayName: input.displayName }).catch(
        () => {},
      )
    }
    const idToken = await cred.user.getIdToken(true)

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        idToken,
        role: input.role,
        displayName: input.displayName,
        profile: input.profile ?? {},
      }),
    })
    const json = (await res.json().catch(() => ({}))) as {
      ok?: boolean
      role?: Role
      error?: string
    }

    if (!res.ok || !json.ok || !json.role) {
      return {
        ok: false,
        error: json.error || "Account was created but the server could not start a session.",
      }
    }
    return { ok: true, role: json.role, uid: cred.user.uid }
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code
    return {
      ok: false,
      error: friendlyError(code, "Sign up failed. Please try again."),
    }
  }
}

export async function signOut(): Promise<void> {
  // Best-effort: clear server cookie first, then client SDK state.
  try {
    await fetch("/api/auth/signout", { method: "POST" })
  } catch {
    // ignore
  }
  const auth = getFirebaseAuth()
  if (auth) {
    try {
      await firebaseSignOut(auth)
    } catch {
      // ignore
    }
  }
}
