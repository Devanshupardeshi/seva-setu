import { NextResponse } from "next/server"

export const runtime = "nodejs"

/** POST /api/auth/signout — clears auth cookies. */
export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set("session", "", { path: "/", maxAge: 0 })
  res.cookies.set("role", "", { path: "/", maxAge: 0 })
  return res
}
