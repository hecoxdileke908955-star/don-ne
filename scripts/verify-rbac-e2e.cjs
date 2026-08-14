const { spawnSync } = require('node:child_process');
const argon2 = require('argon2');
const { PrismaClient } = require('@prisma/client');

const base = process.env.E2E_BASE_URL;
const superAdmin = {
  email: process.env.ADMIN_INITIAL_EMAIL,
  password: process.env.ADMIN_INITIAL_PASSWORD,
  fullName: process.env.ADMIN_INITIAL_NAME,
};
const testPassword = process.env.RBAC_TEST_PASSWORD;
const request = (path, options = {}) => fetch(`${base}${path}`, {
  ...options,
  redirect: 'manual',
  signal: AbortSignal.timeout(15_000),
});
const endpoints = {
  leads: '/api/admin/leads',
  pricing: '/api/admin/pricing',
  services: '/api/admin/services',
  settings: '/api/admin/settings',
};
const argonOptions = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
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
  assert(response.status === 200 && cookie, `Login failed for ${email}`);
  return cookie;
}

async function statuses(cookie) {
  const headers = { cookie };
  return Object.fromEntries(await Promise.all(
    Object.entries(endpoints).map(async ([name, path]) => [name, (await request(path, { headers })).status])
  ));
}

function allAllowed(result) {
  return Object.values(result).every((status) => status === 200);
}

function editorRestrictions(result) {
  return result.services === 200
    && result.leads === 403
    && result.pricing === 403
    && result.settings === 403;
}

async function assertRestrictedPages(cookie) {
  for (const path of ['/admin/leads', '/admin/pricing', '/admin/settings']) {
    const response = await request(path, { headers: { cookie } });
    const body = await response.text();
    assert(
      response.status >= 300
        && response.status < 400
        && response.headers.get('location')?.endsWith('/admin')
        && !body.includes('customerName'),
      `Editor restricted page was not rejected safely: ${path}`
    );
  }
}

async function assertSidebar(cookie, expectedEditor) {
  const response = await request('/admin', { headers: { cookie } });
  const html = await response.text();
  const hasServices = html.includes('href="/admin/services"');
  const hasRestricted = ['/admin/leads', '/admin/pricing', '/admin/settings']
    .some((path) => html.includes(`href="${path}"`));
  assert(response.status === 200 && hasServices && hasRestricted !== expectedEditor, 'Sidebar does not match the current role');
}

async function main() {
  if (!base || !superAdmin.email || !superAdmin.password || !superAdmin.fullName || !testPassword) {
    throw new Error('Required E2E process environment is missing');
  }

  const prisma = new PrismaClient();

  try {
    const provision = provisionSuperAdmin();
    assert(provision.status === 0, 'Initial super-admin provisioning failed');

    const passwordHash = await argon2.hash(testPassword, argonOptions);
    const admin = await prisma.user.create({
      data: { email: 'rbac-admin@example.test', passwordHash, fullName: 'RBAC Admin', role: 'ADMIN' },
    });
    const editor = await prisma.user.create({
      data: { email: 'rbac-editor@example.test', passwordHash, fullName: 'RBAC Editor', role: 'EDITOR' },
    });
    const createdUsersAreHashed = passwordHash.startsWith('$argon2id$') && !passwordHash.includes(testPassword);
    assert(createdUsersAreHashed, 'Test users were not provisioned with Argon2id');

    const superCookie = await login(superAdmin.email, superAdmin.password);
    const adminCookie = await login(admin.email, testPassword);
    const editorCookie = await login(editor.email, testPassword);

    const unauthenticated = await request(endpoints.pricing);
    const superAdminApis = await statuses(superCookie);
    const adminApis = await statuses(adminCookie);
    const editorApis = await statuses(editorCookie);
    assert(unauthenticated.status === 401, 'Unauthenticated protected API did not return 401');
    assert(allAllowed(superAdminApis), 'SUPER_ADMIN did not receive all required API access');
    assert(allAllowed(adminApis), 'ADMIN did not receive all required API access');
    assert(editorRestrictions(editorApis), 'EDITOR API permissions were incorrect');
    await assertRestrictedPages(editorCookie);
    await assertSidebar(editorCookie, true);

    await prisma.user.update({ where: { id: editor.id }, data: { role: 'ADMIN' } });
    const promotedApis = await statuses(editorCookie);
    assert(allAllowed(promotedApis), 'Existing session did not gain ADMIN permissions after DB role change');
    await assertSidebar(editorCookie, false);

    await prisma.user.update({ where: { id: editor.id }, data: { role: 'EDITOR' } });
    const demotedApis = await statuses(editorCookie);
    assert(editorRestrictions(demotedApis), 'Existing session did not lose restricted permissions after DB role change');
    await assertSidebar(editorCookie, true);

    console.log(JSON.stringify({
      superAdmin: superAdminApis,
      admin: adminApis,
      editor: editorApis,
      unauthenticated: unauthenticated.status,
      restrictedPages: 'redirected-without-data',
      editorPromoted: promotedApis,
      editorDemoted: demotedApis,
      sidebar: 'current-db-role',
    }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
