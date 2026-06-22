import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'bowhdp_super_secret_key_change_in_prod');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that do not require authentication
  const isPublicPath = pathname === '/login' || pathname.startsWith('/api/auth') || pathname.startsWith('/api/webhooks') || pathname.startsWith('/api/seed');
  
  // API paths that we might want to restrict (excluding auth/webhooks handled above)
  const isApiPath = pathname.startsWith('/api/');

  // Get the token from cookies
  const token = request.cookies.get('auth_token')?.value || '';

  // If there's no token and it's not a public path, redirect to login
  if (!isPublicPath && !token) {
    if (isApiPath) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If there's a token, verify it
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // If the user is on the login page but already has a valid token, redirect to dashboard
      if (pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Basic Role-Based Routing (RBAC) Example
      const role = payload.role as string;

      // Restrict "Complaints" inbox to Admins only
      if (pathname.startsWith('/complaints') && role !== 'Admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Pass user info downstream via headers (optional, for Server Components)
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-role', role);
      requestHeaders.set('x-user-id', payload.id as string);
      requestHeaders.set('x-user-name', payload.name as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (error) {
      // Token is invalid/expired
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set('auth_token', '', { maxAge: 0 }); // Clear invalid cookie
      
      if (isApiPath && !isPublicPath) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      return response;
    }
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
