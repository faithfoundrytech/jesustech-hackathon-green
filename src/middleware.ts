import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/church/dashboard'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(prefix => 
    path === prefix || path.startsWith(`${prefix}/`)
  );

  if (isProtectedPath) {
    // Get the token from cookies
    const token = request.cookies.get('harmony_auth_token');
    
    // If no token, redirect to login
    if (!token) {
      const url = new URL('/church/login', request.url);
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
    
    // If token exists, allow the request to proceed
    // We'll do the actual validation in the API route or server component
    return NextResponse.next();
  }
  
  // Not a protected path, let the request proceed
  return NextResponse.next();
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    '/church/dashboard/:path*', // Matches all dashboard routes
  ]
}; 