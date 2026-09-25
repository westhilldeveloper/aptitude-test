import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const auth = request.cookies.get('admin_auth')?.value;
    if (auth !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};