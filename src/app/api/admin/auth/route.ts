import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from '@/lib/admin-session';

export const runtime = 'nodejs';

function safeEqualText(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      typeof body?.password !== 'string' ||
      body.password.length < 1 ||
      body.password.length > 256
    ) {
      return NextResponse.json(
        { error: 'Mật khẩu không hợp lệ' },
        { status: 400 }
      );
    }

    const bootstrapPassword =
      process.env.ADMIN_BOOTSTRAP_PASSWORD;

    if (!bootstrapPassword || bootstrapPassword.includes('CHANGE_ME')) {
      return NextResponse.json(
        { error: 'Server authentication is not configured' },
        { status: 500 }
      );
    }

    if (!safeEqualText(body.password, bootstrapPassword)) {
      await new Promise((resolve) =>
        setTimeout(resolve, 400)
      );

      return NextResponse.json(
        { error: 'Mật khẩu quản trị không chính xác' },
        { status: 401 }
      );
    }

    const user = {
      userId: 'bootstrap-super-admin',
      email: 'admin@donne.vn',
      fullName: 'Chủ Quản Dọn Nè',
      role: 'SUPER_ADMIN' as const,
    };

    const token =
      await createAdminSessionToken(user);

    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    response.headers.set(
      'Cache-Control',
      'no-store'
    );

    return response;
  } catch (error) {
    console.error(
      'Admin authentication failed:',
      error instanceof Error ? error.message : error
    );

    return NextResponse.json(
      { error: 'Không thể đăng nhập' },
      { status: 500 }
    );
  }
}
