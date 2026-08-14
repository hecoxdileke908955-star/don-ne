import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from './lib/admin-session';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Hai endpoint này phải truy cập được khi chưa đăng nhập.
  if (
    pathname === '/api/admin/auth' ||
    pathname === '/api/admin/auth/logout'
  ) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  const session =
    await verifyAdminSessionToken(token);

  if (!session) {
    // API admin trả 401, không redirect HTML.
    if (pathname.startsWith('/api/admin/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // Trang admin chưa đăng nhập -> trang login.
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = '/admin-login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', pathname);

    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  response.headers.set(
    'Cache-Control',
    'no-store'
  );

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
