import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Auth routes that should show their own pages
  const authRoutes = ['/login', '/sign-up']
  
  // If trying to access auth routes but seeing home page content
  if (authRoutes.includes(path)) {
    return NextResponse.rewrite(new URL(path, request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should trigger the middleware
export const config = {
  matcher: ['/login', '/sign-up']
} 