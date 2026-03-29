import { NextResponse } from 'next/server';
import { parseAuthCookie } from './libs/parseAuthCookie';
import { jwtVerify } from 'jose';

async function verifyJwt(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request) {
  const token = parseAuthCookie(request.headers.get('cookie'));

  const pathname = request.nextUrl.pathname;
  const isPublicRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isProtectedRoute = !isPublicRoute;

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyJwt(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('authToken');
      return response;
    }
  } else {
    // If user is already on a public route but has a valid token, push them to dashboard
    if (token) {
      const payload = await verifyJwt(token);
      if (payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}