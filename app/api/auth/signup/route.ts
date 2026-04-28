import { NextResponse } from "next/server"
import {
  getAdminAuth,
  getAdminDb,
  isAdminConfigured,
} from "@/backend/firebase/admin"

export const runtime = "nodejs"

const SESSION_COOKIE = "session"
const ROLE_COOKIE = "role"
const FIVE_DAYS_SECONDS = 60 * 60 * 24 * 5
const FIVE_DAYS_MS = FIVE_DAYS_SECONDS * 1000

type Role = "volunteer" | "ngo"

type Body = {
  idToken?: string
  role?: Role
  displayName?: string
  profile?: Record<string, unknown>
}

/**
 * POST /api/auth/signup
 * Body: { idToken, role, displayName, profile? }
 *
 * Called immediately AFTER the client has created a Firebase Auth user with
 * `createUserWithEmailAndPassword`. This route:
 *   - Verifies the ID token.
 *   - Sets a `role` custom claim on the Firebase user.
 *   - Writes `users/{uid}` (canonical role lookup) and the role-specific
 *     profile doc (`volunteers/{uid}` or `ngos/{uid}`).
 *   - Issues the session + role cookies so the user is logged in.
 */
export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Server is not configured. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in Vercel env vars.",
      },
      { status: 503 },
    )
  }

  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 })
  }

  const { idToken, role, displayName, profile } = body
  if (!idToken) {
    return NextResponse.json({ ok: false, error: "Missing idToken." }, { status: 400 })
  }
  if (role !== "volunteer" && role !== "ngo") {
    return NextResponse.json(
      { ok: false, error: "Invalid role. Expected 'volunteer' or 'ngo'." },
      { status: 400 },
    )
  }

  const auth = getAdminAuth()
  const db = getAdminDb()
  if (!auth || !db) {
    return NextResponse.json(
      { ok: false, error: "Firebase Admin unavailable." },
      { status: 503 },
    )
  }

  // 1. Verify the ID token issued by the client SDK on createUserWithEmailAndPassword.
  let decoded
  try {
    decoded = await auth.verifyIdToken(idToken, true)
  } catch (err) {
    console.warn("[auth/signup] verifyIdToken failed:", err)
    return NextResponse.json(
      { ok: false, error: "Invalid or expired sign-up token." },
      { status: 401 },
    )
  }
  const uid = decoded.uid
  const email = decoded.email ?? ""

  // 2. Set the role as a custom claim so future ID tokens carry it.
  try {
    await auth.setCustomUserClaims(uid, { role })
  } catch (err) {
    console.warn("[auth/signup] setCustomUserClaims failed:", err)
  }

  // 3. Persist canonical role lookup + role-specific profile.
  const now = new Date().toISOString()
  try {
    await db
      .collection("users")
      .doc(uid)
      .set(
        {
          uid,
          email,
          role,
          displayName: displayName ?? "",
          createdAt: now,
        },
        { merge: true },
      )

    const profileCollection = role === "volunteer" ? "volunteers" : "ngos"
    await db
      .collection(profileCollection)
      .doc(uid)
      .set(
        {
          id: uid,
          email,
          name: displayName ?? "",
          ...(profile ?? {}),
          createdAt: now,
        },
        { merge: true },
      )
  } catch (err) {
    console.error("[auth/signup] Firestore write failed:", err)
    return NextResponse.json(
      { ok: false, error: "Account created but profile could not be saved." },
      { status: 500 },
    )
  }

  // 4. Mint a session cookie. Note: createSessionCookie needs the same idToken
  //    we already verified — this works as long as the token is fresh (<5 min).
  let sessionCookie: string
  try {
    sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: FIVE_DAYS_MS,
    })
  } catch (err) {
    console.error("[auth/signup] createSessionCookie failed:", err)
    return NextResponse.json(
      { ok: false, error: "Account created but session could not be started." },
      { status: 500 },
    )
  }

  const res = NextResponse.json({ ok: true, role, uid })
  const secure = process.env.NODE_ENV === "production"

  res.cookies.set(SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: FIVE_DAYS_SECONDS,
  })
  res.cookies.set(ROLE_COOKIE, role, {
    httpOnly: false,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: FIVE_DAYS_SECONDS,
  })

  return res
}
