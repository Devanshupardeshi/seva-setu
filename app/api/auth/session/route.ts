import { NextResponse } from "next/server"
import { getAdminAuth, getAdminDb, isAdminConfigured } from "@/backend/firebase/admin"

export const runtime = "nodejs"

const SESSION_COOKIE = "session"
const ROLE_COOKIE = "role"
// 5 days, in seconds for cookie maxAge and milliseconds for createSessionCookie.
const FIVE_DAYS_SECONDS = 60 * 60 * 24 * 5
const FIVE_DAYS_MS = FIVE_DAYS_SECONDS * 1000

/**
 * POST /api/auth/session
 * Body: { idToken: string }
 *
 * Verifies the Firebase ID token, mints a long-lived session cookie via the
 * Admin SDK, and reads the user's role (from custom claim or Firestore).
 * Sets two cookies:
 *   - `session` (httpOnly) — used by proxy.ts to gate protected routes.
 *   - `role`              — used by proxy.ts and the UI to drive role redirects.
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

  let idToken: string | undefined
  try {
    const body = (await req.json()) as { idToken?: string }
    idToken = body.idToken
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 })
  }
  if (!idToken) {
    return NextResponse.json({ ok: false, error: "Missing idToken." }, { status: 400 })
  }

  const auth = getAdminAuth()
  const db = getAdminDb()
  if (!auth) {
    return NextResponse.json(
      { ok: false, error: "Firebase Admin auth unavailable." },
      { status: 503 },
    )
  }

  // 1. Verify the ID token (rejects expired / forged tokens).
  let decoded
  try {
    decoded = await auth.verifyIdToken(idToken, true)
  } catch (err) {
    console.warn("[auth/session] verifyIdToken failed:", err)
    return NextResponse.json(
      { ok: false, error: "Invalid or expired sign-in token." },
      { status: 401 },
    )
  }

  // 2. Resolve role: prefer custom claim, fall back to users/{uid}.role.
  let role: "volunteer" | "ngo" | undefined =
    decoded.role === "volunteer" || decoded.role === "ngo"
      ? (decoded.role as "volunteer" | "ngo")
      : undefined

  if (!role && db) {
    try {
      const snap = await db.collection("users").doc(decoded.uid).get()
      const data = snap.data() as { role?: "volunteer" | "ngo" } | undefined
      if (data?.role === "volunteer" || data?.role === "ngo") role = data.role
    } catch (err) {
      console.warn("[auth/session] failed reading users doc:", err)
    }
  }

  if (!role) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "This account has no role assigned. Ask an admin to set users/<uid>.role to 'volunteer' or 'ngo'.",
      },
      { status: 403 },
    )
  }

  // 3. Mint the long-lived session cookie.
  let sessionCookie: string
  try {
    sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: FIVE_DAYS_MS,
    })
  } catch (err) {
    console.error("[auth/session] createSessionCookie failed:", err)
    return NextResponse.json(
      { ok: false, error: "Could not create session." },
      { status: 500 },
    )
  }

  const res = NextResponse.json({ ok: true, role, uid: decoded.uid })
  const secure = process.env.NODE_ENV === "production"

  res.cookies.set(SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: FIVE_DAYS_SECONDS,
  })
  res.cookies.set(ROLE_COOKIE, role, {
    httpOnly: false, // role is not a secret; UI may read it.
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: FIVE_DAYS_SECONDS,
  })

  return res
}

/** DELETE /api/auth/session — clear the session cookies (signout). */
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 })
  res.cookies.set(ROLE_COOKIE, "", { path: "/", maxAge: 0 })
  return res
}
