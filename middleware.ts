import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  
  // Protect specific routes
  const protectedPaths = ['/volunteer', '/ngo', '/command-center', '/impact']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // For this demo hackathon phase, we're not enforcing absolute redirect blocks 
  // until the auth system is fully populated, but this is the hook point.
  // if (isProtectedPath && !session) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
