import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Next.js 16: renamed from middleware.ts → proxy.ts, function name → proxy
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page always — no checks
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  // For all other /admin/* pages, check cookie exists
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('session_token')?.value
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}
