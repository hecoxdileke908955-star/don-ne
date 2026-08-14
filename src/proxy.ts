import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from './lib/admin-session';

function contentSecurityPolicy(nonce: string): string {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}'${isDevelopment ? " 'unsafe-inline'" : ''}`,
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

function isTrustedHttpsRequest(request: NextRequest): boolean {
  if (process.env.VERCEL === '1' || process.env.TRUST_PROXY_HEADERS === '1') {
    return request.headers.get('x-forwarded-proto') === 'https';
  }

  return request.nextUrl.protocol === 'https:';
}

function applySecurityHeaders(
  response: NextResponse,
  csp: string,
  request: NextRequest
): NextResponse {
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-Frame-Options', 'DENY');

  if (process.env.NODE_ENV === 'production' && isTrustedHttpsRequest(request)) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000');
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const nonce = btoa(crypto.randomUUID());
  const csp = contentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);
  const next = () => applySecurityHeaders(
    NextResponse.next({ request: { headers: requestHeaders } }),
    csp,
    request
  );

  // Hai endpoint này phải truy cập được khi chưa đăng nhập.
  if (
    pathname === '/api/admin/auth' ||
    pathname === '/api/admin/auth/logout'
  ) {
    return next();
  }

  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname.startsWith('/api/admin/');

  if (!isAdminPage && !isAdminApi) return next();

  const token =
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  const session =
    await verifyAdminSessionToken(token);

  if (!session) {
    // API admin trả 401, không redirect HTML.
    if (pathname.startsWith('/api/admin/')) {
      return applySecurityHeaders(NextResponse.json(
        { error: 'Unauthorized' },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      ), csp, request);
    }

    // Trang admin chưa đăng nhập -> trang login.
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = '/admin-login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', pathname);

    return applySecurityHeaders(NextResponse.redirect(loginUrl), csp, request);
  }

  const response = next();

  response.headers.set(
    'Cache-Control',
    'no-store'
  );

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
