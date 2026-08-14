import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from '@/lib/admin-session';
import { hashAdminPassword, isValidAdminPassword, verifyAdminPassword } from '@/lib/admin-password';
import { prisma } from '@/lib/db';
import { enforceRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const DUMMY_PASSWORD_HASH = '$argon2id$v=19$m=19456,p=1,t=2$PDjN2bQlrdejF2aOUKseAQ$uqpyEVwvjqrVwyjDn6LRIMZafgkJwHprUQ7WjJd9DUA';

function invalidCredentials() {
  return NextResponse.json(
    { error: 'Email or password is incorrect' },
    { status: 401 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';
    const password = body?.password;

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || !isValidAdminPassword(password)
    ) {
      return invalidCredentials();
    }

    const rateLimit = await enforceRateLimit(request, 'auth');
    if (rateLimit.status === 'unavailable') {
      return NextResponse.json(
        { error: 'Authentication temporarily unavailable' },
        { status: 503 }
      );
    }
    if (rateLimit.status === 'limited') {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        isActive: true,
        passwordHash: true,
      },
    });

    // Absent accounts still verify a fixed Argon2id hash to avoid a cheap
    // account-existence timing shortcut on the common invalid-login path.
    const passwordResult = await verifyAdminPassword(
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
      password
    );

    if (!user || !user.isActive || !passwordResult.valid) {
      return invalidCredentials();
    }

    if (passwordResult.needsRehash) {
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: await hashAdminPassword(password) },
      });
    }

    const token = await createAdminSessionToken({ userId: user.id });
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch {
    console.error('Admin authentication failed: unexpected server error');
    return NextResponse.json(
      { error: 'Authentication temporarily unavailable' },
      { status: 503 }
    );
  }
}
