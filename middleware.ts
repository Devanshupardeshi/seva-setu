import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl
  
  // Protect specific routes
  const protectedPaths = ['/volunteer', '/ngo', '/command-center']
  
  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  // EXEMPTIONS: Registration and onboarding must be public
  const isPublicExemption = 
    pathname.startsWith('/volunteer/onboarding') || 
    pathname.startsWith('/ngo/register')

  if (isProtectedPath && !isPublicExemption) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based access control
    const role = request.cookies.get('role')?.value
    if (role === 'volunteer' && pathname.startsWith('/command-center')) {
      return NextResponse.redirect(new URL('/volunteer', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
