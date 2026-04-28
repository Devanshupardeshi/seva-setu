import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Next.js 16 proxy (formerly middleware).
 *
 * Responsibilities:
 *   1. Mode propagation: lift the `app-mode` cookie into an `x-app-mode`
 *      request header so server components and API handlers can read it
 *      synchronously without re-parsing cookies.
 *   2. Auth gating — ONLY in Actual Mode. Demo Mode is the public sandbox:
 *      anyone can browse /volunteer, /ngo, /command-center to see the
 *      prototype with mock data. The dashboards already render mock fixtures
 *      via `useAppMode().isDemo`, so no login screen is needed.
 *   3. Role-based redirects (volunteers cannot access command center) —
 *      again, only in Actual Mode.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ---- Mode propagation -------------------------------------------------
  const modeCookie = request.cookies.get("app-mode")?.value
  const mode = modeCookie === "actual" ? "actual" : "demo"

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-app-mode", mode)

  // ---- Demo Mode = open sandbox ----------------------------------------
  // Skip every auth / role gate so reviewers can poke around freely.
  if (mode === "demo") {
    // If a logged-out demo visitor lands on /login or /signup, send them
    // straight into the volunteer dashboard so the demo "feels" logged in.
    if (pathname === "/login" || pathname === "/signup") {
      return NextResponse.redirect(new URL("/volunteer", request.url))
    }
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // ---- Actual Mode: enforce auth ---------------------------------------
  const protectedPaths = ["/volunteer", "/ngo", "/command-center"]
  const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p))

  // Public exemptions: signup / onboarding / NGO register are reachable
  // even without a session because they're how new users join.
  const isPublicExemption =
    pathname.startsWith("/volunteer/onboarding") ||
    pathname.startsWith("/volunteer/signup") ||
    pathname.startsWith("/ngo/register")

  if (isProtectedPath && !isPublicExemption) {
    const session = request.cookies.get("session")
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const role = request.cookies.get("role")?.value
    if (role === "volunteer" && pathname.startsWith("/command-center")) {
      return NextResponse.redirect(new URL("/volunteer", request.url))
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

// Backwards-compatibility export for tooling that still expects a
// `middleware` named export.
export const middleware = proxy

export const config = {
  matcher: ["/((?!api/health|_next/static|_next/image|favicon.ico).*)"],
}
