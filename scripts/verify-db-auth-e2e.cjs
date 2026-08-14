const { createHmac } = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { PrismaClient } = require('@prisma/client');

const base = process.env.E2E_BASE_URL;
const initialEmail = process.env.ADMIN_INITIAL_EMAIL;
const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
const initialName = process.env.ADMIN_INITIAL_NAME;
const jwtSecret = process.env.JWT_SECRET;
const legacyPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const request = (path, options = {}) => fetch(`${base}${path}`, {
  ...options,
  signal: AbortSignal.timeout(15_000),
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function json(response) {
  return response.json().catch(() => ({}));
}

function provision() {
  return spawnSync(process.execPath, ['scripts/provision-super-admin.cjs'], {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
  });
}

function oldSessionCookie() {
  const payload = Buffer.from(JSON.stringify({
    userId: 'bootstrap-super-admin',
    email: 'admin@donne.vn',
    fullName: 'Bootstrap Admin',
    role: 'SUPER_ADMIN',
    exp: Math.floor(Date.now() / 1000) + 600,
  })).toString('base64url');
  const signature = createHmac('sha256', jwtSecret).update(payload).digest('base64url');
  return `don_ne_admin_session=${payload}.${signature}`;
}

async function login(email, password) {
  const response = await request('/api/admin/auth', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return { response, body: await json(response) };
}

async function main() {
  if (!base || !initialEmail || !initialPassword || !initialName || !jwtSecret || !legacyPassword) {
    throw new Error('Required E2E process environment is missing');
  }

  const prisma = new PrismaClient();

  try {
    const firstProvision = provision();
    assert(firstProvision.status === 0, 'Expected first super-admin provisioning to succeed');

    const user = await prisma.user.findUnique({ where: { email: initialEmail.toLowerCase() } });
    assert(
      user?.role === 'SUPER_ADMIN'
      && user.isActive
      && user.passwordHash.startsWith('$argon2id$')
      && !user.passwordHash.includes(initialPassword),
      'Expected a non-plaintext Argon2id super-admin record'
    );

    const repeatProvision = provision();
    assert(repeatProvision.status !== 0, 'Expected duplicate provisioning to be rejected');

    const correct = await login(initialEmail, initialPassword);
    const cookie = correct.response.headers.get('set-cookie')?.split(';')[0];
    const cookieHeader = correct.response.headers.get('set-cookie') ?? '';
    assert(
      correct.response.status === 200
      && correct.body.success === true
      && cookie
      && /httponly/i.test(cookieHeader)
      && /samesite=strict/i.test(cookieHeader)
      && /secure/i.test(cookieHeader),
      'Expected a secure signed admin session cookie'
    );

    const payload = JSON.parse(Buffer.from(cookie.split('=')[1].split('.')[0], 'base64url').toString('utf8'));
    assert(
      payload.version === 2
      && payload.userId === user.id
      && !('role' in payload)
      && !('email' in payload)
      && !('fullName' in payload),
      'Expected minimal versioned session claims'
    );

    const wrongPassword = await login(initialEmail, `${initialPassword}x`);
    const unknownEmail = await login('unknown@example.test', initialPassword);
    assert(
      wrongPassword.response.status === 401
      && unknownEmail.response.status === 401
      && JSON.stringify(wrongPassword.body) === JSON.stringify(unknownEmail.body),
      'Expected generic equivalent invalid-credential responses'
    );

    const protectedRead = await request('/api/admin/pricing', { headers: { cookie } });
    assert(protectedRead.status === 200, 'Expected active-user protected API access');

    const tampered = await request('/api/admin/pricing', { headers: { cookie: `${cookie}x` } });
    assert(tampered.status === 401, 'Expected tampered session rejection');

    const oldSession = await request('/api/admin/pricing', { headers: { cookie: oldSessionCookie() } });
    assert(oldSession.status === 401, 'Expected bootstrap-era session rejection');

    await prisma.user.update({ where: { id: user.id }, data: { isActive: false } });
    const deactivated = await request('/api/admin/pricing', { headers: { cookie } });
    assert(deactivated.status === 401, 'Expected deactivated user session rejection');

    await prisma.user.update({ where: { id: user.id }, data: { isActive: true } });
    const reactivated = await login(initialEmail, initialPassword);
    const reactivatedCookie = reactivated.response.headers.get('set-cookie')?.split(';')[0];
    assert(reactivated.response.status === 200 && reactivatedCookie, 'Expected reactivated user login');

    await prisma.user.delete({ where: { id: user.id } });
    const deleted = await request('/api/admin/pricing', { headers: { cookie: reactivatedCookie } });
    assert(deleted.status === 401, 'Expected deleted user session rejection');

    const bootstrap = await login('admin@donne.vn', legacyPassword);
    assert(bootstrap.response.status === 401, 'Expected legacy bootstrap password rejection');

    console.log(JSON.stringify({
      provisioned: true,
      duplicateProvisionRejected: true,
      login: correct.response.status,
      wrongPassword: wrongPassword.response.status,
      unknownEmail: unknownEmail.response.status,
      protectedRead: protectedRead.status,
      tampered: tampered.status,
      oldSession: oldSession.status,
      deactivated: deactivated.status,
      reactivated: reactivated.response.status,
      deleted: deleted.status,
      bootstrap: bootstrap.response.status,
    }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
