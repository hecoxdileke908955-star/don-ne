const { spawnSync, execFileSync } = require('node:child_process');
const argon2 = require('argon2');
const { PrismaClient } = require('@prisma/client');

const base = process.env.E2E_BASE_URL;
const container = process.env.E2E_DATABASE_CONTAINER;
const superAdmin = {
  email: process.env.ADMIN_INITIAL_EMAIL,
  password: process.env.ADMIN_INITIAL_PASSWORD,
  fullName: process.env.ADMIN_INITIAL_NAME,
};
const testPassword = process.env.RBAC_TEST_PASSWORD;
const argonOptions = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};

const request = (path, options = {}) => fetch(`${base}${path}`, {
  ...options,
  redirect: 'manual',
  signal: AbortSignal.timeout(15_000),
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function json(response) {
  return response.json().catch(() => ({}));
}

function safeBody(body) {
  return !/(prisma|postgres|database|sql|p20\d\d|stack|[a-z]:\\|\/app\/|\/src\/)/i.test(JSON.stringify(body));
}

function provisionSuperAdmin() {
  return spawnSync(process.execPath, ['scripts/provision-super-admin.cjs'], {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
  });
}

async function login(email, password) {
  const response = await request('/api/admin/auth', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const cookie = response.headers.get('set-cookie')?.split(';')[0];
  return { status: response.status, cookie };
}

async function main() {
  if (!base || !container || !superAdmin.email || !superAdmin.password || !superAdmin.fullName || !testPassword) {
    throw new Error('Required E2E process environment is missing');
  }

  const prisma = new PrismaClient();

  try {
    const provision = provisionSuperAdmin();
    assert(provision.status === 0, 'Initial super-admin provisioning failed');

    const superLogin = await login(superAdmin.email, superAdmin.password);
    assert(superLogin.status === 200 && superLogin.cookie, 'Super-admin login failed');
    const superCookie = superLogin.cookie;
    const superHeaders = { cookie: superCookie, origin: base, 'content-type': 'application/json' };

    const superUser = await prisma.user.findUniqueOrThrow({ where: { email: superAdmin.email } });

    const passwordHash = await argon2.hash(testPassword, argonOptions);
    const admin = await prisma.user.create({ data: { email: 'users-admin@example.test', passwordHash, fullName: 'Users Admin', role: 'ADMIN' } });
    const editor = await prisma.user.create({ data: { email: 'users-editor@example.test', passwordHash, fullName: 'Users Editor', role: 'EDITOR' } });
    const adminLogin = await login(admin.email, testPassword);
    const editorLogin = await login(editor.email, testPassword);
    assert(adminLogin.status === 200 && adminLogin.cookie, 'ADMIN login failed');
    assert(editorLogin.status === 200 && editorLogin.cookie, 'EDITOR login failed');

    // O. unauthenticated
    const unauth = await request('/api/admin/users');
    assert(unauth.status === 401, 'Unauthenticated Users API did not return 401');

    // A. SUPER_ADMIN GET
    const superList = await request('/api/admin/users', { headers: { cookie: superCookie } });
    const superListBody = await json(superList);
    assert(superList.status === 200 && Array.isArray(superListBody.users), 'SUPER_ADMIN could not list users');
    assert(superListBody.users.every((u) => !('passwordHash' in u) && !('password' in u)), 'passwordHash leaked in list response');

    // B/C. ADMIN and EDITOR forbidden
    const adminList = await request('/api/admin/users', { headers: { cookie: adminLogin.cookie } });
    const editorList = await request('/api/admin/users', { headers: { cookie: editorLogin.cookie } });
    assert(adminList.status === 403, 'ADMIN Users API did not return 403');
    assert(editorList.status === 403, 'EDITOR Users API did not return 403');

    // D. SUPER_ADMIN creates ADMIN
    const newAdminEmail = 'users-created-admin@example.test';
    const newAdminPassword = 'CorrectHorseBatteryStaple1!';
    const create = await request('/api/admin/users', {
      method: 'POST', headers: superHeaders,
      body: JSON.stringify({ fullName: 'Created Admin', email: newAdminEmail, password: newAdminPassword, role: 'ADMIN' }),
    });
    const createBody = await json(create);
    assert(create.status === 201 && createBody.user?.id, 'SUPER_ADMIN could not create a new ADMIN user');
    assert(!('passwordHash' in createBody.user) && !('password' in createBody.user), 'passwordHash leaked in create response');
    const createdId = createBody.user.id;

    const createdDbUser = await prisma.user.findUniqueOrThrow({ where: { id: createdId } });
    assert(createdDbUser.role === 'ADMIN' && createdDbUser.isActive === true, 'Created user role/isActive incorrect in DB');
    assert(createdDbUser.passwordHash.startsWith('$argon2id$') && !createdDbUser.passwordHash.includes(newAdminPassword), 'Created user password was not stored as an Argon2id hash');

    // E. duplicate email
    const duplicate = await request('/api/admin/users', {
      method: 'POST', headers: superHeaders,
      body: JSON.stringify({ fullName: 'Duplicate Admin', email: newAdminEmail, password: newAdminPassword, role: 'ADMIN' }),
    });
    assert(duplicate.status === 409, 'Duplicate email did not return 409');

    // F. created ADMIN can log in
    const createdLogin = await login(newAdminEmail, newAdminPassword);
    assert(createdLogin.status === 200 && createdLogin.cookie, 'Newly created ADMIN could not log in');

    // G. ADMIN -> EDITOR, existing session immediately restricted
    const beforeDemotionLeads = await request('/api/admin/leads', { headers: { cookie: createdLogin.cookie } });
    assert(beforeDemotionLeads.status === 200, 'Created ADMIN did not have ADMIN-level access before demotion');
    const demote = await request(`/api/admin/users/${createdId}`, { method: 'PATCH', headers: superHeaders, body: JSON.stringify({ role: 'EDITOR' }) });
    assert(demote.status === 200, 'Role demotion request failed');
    const demotedDbUser = await prisma.user.findUniqueOrThrow({ where: { id: createdId } });
    assert(demotedDbUser.role === 'EDITOR', 'Role demotion not reflected in DB');
    const afterDemotionLeads = await request('/api/admin/leads', { headers: { cookie: createdLogin.cookie } });
    assert(afterDemotionLeads.status === 403, 'Existing session did not immediately lose ADMIN permissions after demotion');

    // H. EDITOR -> ADMIN, existing session immediately gains access
    const promote = await request(`/api/admin/users/${createdId}`, { method: 'PATCH', headers: superHeaders, body: JSON.stringify({ role: 'ADMIN' }) });
    assert(promote.status === 200, 'Role promotion request failed');
    const afterPromotionLeads = await request('/api/admin/leads', { headers: { cookie: createdLogin.cookie } });
    assert(afterPromotionLeads.status === 200, 'Existing session did not immediately gain ADMIN permissions after promotion');

    // I. deactivate -> existing session unauthorized
    const deactivate = await request(`/api/admin/users/${createdId}`, { method: 'PATCH', headers: superHeaders, body: JSON.stringify({ isActive: false }) });
    assert(deactivate.status === 200, 'Deactivation request failed');
    const afterDeactivateLeads = await request('/api/admin/leads', { headers: { cookie: createdLogin.cookie } });
    assert(afterDeactivateLeads.status === 401, 'Existing session was not immediately unauthorized after deactivation');

    // J. reactivate -> login works again
    const reactivate = await request(`/api/admin/users/${createdId}`, { method: 'PATCH', headers: superHeaders, body: JSON.stringify({ isActive: true }) });
    assert(reactivate.status === 200, 'Reactivation request failed');
    const reactivatedLogin = await login(newAdminEmail, newAdminPassword);
    assert(reactivatedLogin.status === 200 && reactivatedLogin.cookie, 'Login failed after reactivation');

    // K. self-deactivation rejected
    const selfDeactivate = await request(`/api/admin/users/${superUser.id}`, { method: 'PATCH', headers: superHeaders, body: JSON.stringify({ isActive: false }) });
    assert(selfDeactivate.status === 409, 'Self-deactivation was not rejected');

    // L. self-demotion rejected
    const selfDemote = await request(`/api/admin/users/${superUser.id}`, { method: 'PATCH', headers: superHeaders, body: JSON.stringify({ role: 'ADMIN' }) });
    assert(selfDemote.status === 409, 'Self-demotion was not rejected');

    // M. last active SUPER_ADMIN is protected, including under concurrent requests.
    const secondSuperEmail = 'users-second-super@example.test';
    const secondSuperCreate = await request('/api/admin/users', {
      method: 'POST', headers: superHeaders,
      body: JSON.stringify({ fullName: 'Second Super', email: secondSuperEmail, password: newAdminPassword, role: 'SUPER_ADMIN' }),
    });
    const secondSuperId = (await json(secondSuperCreate)).user.id;
    const secondSuperLogin = await login(secondSuperEmail, newAdminPassword);
    assert(secondSuperLogin.status === 200 && secondSuperLogin.cookie, 'Second SUPER_ADMIN login failed');
    const secondSuperHeaders = { cookie: secondSuperLogin.cookie, origin: base, 'content-type': 'application/json' };

    // Exactly two active SUPER_ADMINs exist now (bootstrap + secondSuper). Fire
    // mutual deactivation attempts concurrently: each request is legal in
    // isolation (the other account is still active), so the advisory lock
    // must serialize them and reject whichever one would zero out the count.
    const [mutualA, mutualB] = await Promise.all([
      request(`/api/admin/users/${secondSuperId}`, { method: 'PATCH', headers: superHeaders, body: JSON.stringify({ isActive: false }) }),
      request(`/api/admin/users/${superUser.id}`, { method: 'PATCH', headers: secondSuperHeaders, body: JSON.stringify({ isActive: false }) }),
    ]);
    const activeSuperAdminCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN', isActive: true } });
    assert(activeSuperAdminCount >= 1, 'Concurrent requests reduced active SUPER_ADMIN count to zero');
    assert(!(mutualA.status === 200 && mutualB.status === 200), 'Concurrent mutual deactivation was not serialized against the last-active-SUPER_ADMIN safeguard');

    // Restore both accounts to a clean active state for later checks.
    await prisma.user.update({ where: { id: superUser.id }, data: { isActive: true } });
    await prisma.user.update({ where: { id: secondSuperId }, data: { isActive: true } });
    const explicitLastSuperAttempt = await request(`/api/admin/users/${secondSuperId}`, { method: 'PATCH', headers: secondSuperHeaders, body: JSON.stringify({ role: 'ADMIN' }) });
    // secondSuper acting on itself while it is not the last active super admin
    // is a self-demotion, independently rejected (bootstrap is still active).
    assert(explicitLastSuperAttempt.status === 409, 'Self-demotion of second SUPER_ADMIN was not rejected');
    await prisma.user.update({ where: { id: secondSuperId }, data: { role: 'ADMIN' } });
    const soleActiveSuperCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN', isActive: true } });
    assert(soleActiveSuperCount === 1, 'Expected exactly one active SUPER_ADMIN after cleanup');

    // N. passwordHash never appears anywhere in Users API responses
    const finalList = await request('/api/admin/users', { headers: { cookie: superCookie } });
    const finalListText = await finalList.text();
    assert(!/passwordHash/i.test(finalListText) && !finalListText.includes(newAdminPassword) && !finalListText.includes(testPassword), 'passwordHash or plaintext password leaked in Users API response');

    // P. DB-down representative call. Every admin route resolves the acting
    // User from PostgreSQL on each request (Step 7A); when the database is
    // unreachable, requireAdminSession fails closed to "unauthenticated"
    // rather than trusting a session it cannot re-verify. That yields a safe,
    // generic 401 here (the same fail-closed behavior already established for
    // every other protected admin route, not something introduced in this
    // phase). A 503 would only be observable on a route that reaches its own
    // Prisma call before any session/DB check, which no authenticated admin
    // route does post-Step-7A.
    execFileSync('docker', ['stop', container], { stdio: 'pipe' });
    const dbDown = await request('/api/admin/users', { headers: { cookie: superCookie } });
    const dbDownBody = await json(dbDown);
    assert(dbDown.status === 401 && safeBody(dbDownBody), 'Expected a safe, generic fail-closed response while the database is unavailable');

    console.log(JSON.stringify({
      unauthenticated: unauth.status,
      superAdminList: superList.status,
      adminList: adminList.status,
      editorList: editorList.status,
      created: create.status,
      duplicate: duplicate.status,
      createdLogin: createdLogin.status,
      demote: demote.status,
      afterDemotionLeads: afterDemotionLeads.status,
      promote: promote.status,
      afterPromotionLeads: afterPromotionLeads.status,
      deactivate: deactivate.status,
      afterDeactivateLeads: afterDeactivateLeads.status,
      reactivate: reactivate.status,
      reactivatedLogin: reactivatedLogin.status,
      selfDeactivate: selfDeactivate.status,
      selfDemote: selfDemote.status,
      concurrentLastSuperAdmin: [mutualA.status, mutualB.status],
      activeSuperAdminCountNeverZero: activeSuperAdminCount >= 1,
      dbDown: dbDown.status,
    }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
