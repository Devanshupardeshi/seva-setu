import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Next.js 16 proxy (formerly middleware).
 *
 * Responsibilities:
 *   1. Auth-gate volunteer / ngo / command-center routes (cookie-based).
 *   2. Role-based redirects (volunteers cannot access command center).
 *   3. Mode propagation: lift the `app-mode` cookie into an `x-app-mode`
 *      request header so server components and API handlers can read it
 *      synchronously without re-parsing cookies.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ---- Mode propagation -------------------------------------------------
  const modeCookie = request.cookies.get("app-mode")?.value
  const mode = modeCookie === "actual" ? "actual" : "demo"

  // Forward the mode as a header so handlers can resolveMode(request).
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-app-mode", mode)

  // ---- Route guards -----------------------------------------------------
  const protectedPaths = ["/volunteer", "/ngo", "/command-center"]
  const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p))

  // Exemptions: signup / onboarding / public NGO register are public.
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
