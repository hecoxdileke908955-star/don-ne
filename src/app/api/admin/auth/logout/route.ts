import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-session';
import { requireAdminSession } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';

export async function POST(request: Request) {
  if (!await requireAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  response.headers.set(
    'Cache-Control',
    'no-store'
  );

  return response;
}
