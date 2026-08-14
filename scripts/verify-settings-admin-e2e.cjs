const { execFileSync } = require('node:child_process');
const { PrismaClient } = require('@prisma/client');

const base = process.env.E2E_BASE_URL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const container = process.env.E2E_DATABASE_CONTAINER;
const timeout = (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(15_000) });

async function json(response) { return response.json().catch(() => ({})); }

async function main() {
  if (!base || !password || !container) throw new Error('E2E_BASE_URL, ADMIN_BOOTSTRAP_PASSWORD, and E2E_DATABASE_CONTAINER are required');
  console.error('step: unauthenticated-read');
  const unauthorizedGet = await timeout(`${base}/api/admin/settings`);
  console.error('step: login');
  const login = await timeout(`${base}/api/admin/auth`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) });
  const cookie = login.headers.get('set-cookie')?.split(';')[0];
  if (!login.ok || !cookie) throw new Error('Admin login failed');
  const headers = { cookie, 'content-type': 'application/json' };
  console.error('step: postgres-read');
  const read = await timeout(`${base}/api/admin/settings`, { headers });
  const original = (await json(read)).settings;
  if (!read.ok || !original) throw new Error('Settings read failed');
  const changed = original.hotlines[1].replace(/(\d)(?!.*\d)/, (digit) => digit === '9' ? '8' : '9');
  const updated = { ...original, hotlines: [original.hotlines[0], changed] };
  console.error('step: protected-update');
  const update = await timeout(`${base}/api/admin/settings`, { method: 'PATCH', headers, body: JSON.stringify(updated) });
  const prisma = new PrismaClient();
  const stored = await prisma.globalSetting.findUnique({ where: { key: 'site_config' } });
  const storedValue = stored?.value;
  console.error('step: reload');
  const reload = await timeout(`${base}/api/admin/settings`, { headers });
  const reloadSettings = (await json(reload)).settings;
  const unauthorizedPatch = await timeout(`${base}/api/admin/settings`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(updated) });
  const malformed = await timeout(`${base}/api/admin/settings`, { method: 'PATCH', headers, body: JSON.stringify({}) });
  const invalidPhone = await timeout(`${base}/api/admin/settings`, { method: 'PATCH', headers, body: JSON.stringify({ ...updated, hotlines: [updated.hotlines[0], 'invalid-phone'] }) });
  const invalidUrl = await timeout(`${base}/api/admin/settings`, { method: 'PATCH', headers, body: JSON.stringify({ ...updated, socials: { ...updated.socials, facebook: 'javascript:alert(1)' } }) });
  const invalidEmail = await timeout(`${base}/api/admin/settings`, { method: 'PATCH', headers, body: JSON.stringify({ ...updated, emails: ['not-an-email'] }) });
  const oversized = await timeout(`${base}/api/admin/settings`, { method: 'PATCH', headers, body: JSON.stringify({ ...updated, brandName: 'x'.repeat(121) }) });
  await timeout(`${base}/api/admin/settings`, { method: 'PATCH', headers, body: JSON.stringify(original) });
  await prisma.$disconnect();
  const persisted = storedValue && typeof storedValue === 'object' && storedValue.hotlines?.[1] === changed;
  const valid = unauthorizedGet.status === 401 && update.ok && persisted && reload.ok && reloadSettings?.hotlines?.[1] === changed && unauthorizedPatch.status === 401 && malformed.status === 400 && invalidPhone.status === 400 && invalidUrl.status === 400 && invalidEmail.status === 400 && oversized.status === 400;
  if (!valid) throw new Error('Settings persistence or validation assertion failed');
  console.error('step: db-down');
  execFileSync('docker', ['stop', container], { stdio: 'pipe' });
  const downPatch = await timeout(`${base}/api/admin/settings`, { method: 'PATCH', headers, body: JSON.stringify(updated) });
  const downPatchBody = await json(downPatch);
  const downGet = await timeout(`${base}/api/admin/settings`, { headers });
  const downGetBody = await json(downGet);
  if (downPatch.status !== 503 || downPatchBody.success || downPatchBody.settings || downGet.status !== 503 || downGetBody.settings) throw new Error('Database failure assertion failed');
  console.log(JSON.stringify({ login: login.status, unauthorizedGet: unauthorizedGet.status, update: update.status, directDb: persisted, reload: reload.status, unauthorizedPatch: unauthorizedPatch.status, malformed: malformed.status, invalidPhone: invalidPhone.status, invalidUrl: invalidUrl.status, invalidEmail: invalidEmail.status, oversized: oversized.status, downPatch: downPatch.status, downGet: downGet.status }));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
