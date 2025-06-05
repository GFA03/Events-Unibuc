import { NextRequest, NextResponse } from 'next/server';

const redirectedRules = {
  authenticatedRedirects: ['/', '/auth/login', '/auth/signup'],
  unauthenticatedRedirects: ['/registrations', '/manage-events', '/dashboard', '/admin', '/profile']
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('authToken')?.value;
  const isAuthenticated = !!token;

  if (isAuthenticated && redirectedRules.authenticatedRedirects.includes(pathname)) {
    return NextResponse.redirect(new URL('/events', request.url));
  }

  if (!isAuthenticated && redirectedRules.unauthenticatedRedirects.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
