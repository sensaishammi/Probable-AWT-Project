import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Add paths that don't require authentication
const publicPaths = [
  '/',
  '/api/auth/login',
  '/api/auth/register',
  '/explore',
];

export function middleware(request) {
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user', JSON.stringify(decoded));

    // Check role-based access
    const { role } = decoded;
    const path = request.nextUrl.pathname;

    if (path.startsWith('/restaurant') && role !== 'restaurant') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (path.startsWith('/delivery') && role !== 'delivery') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // If token is invalid, clear it and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 