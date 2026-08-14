const { execFileSync } = require('node:child_process');
const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const base = process.env.E2E_BASE_URL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const container = process.env.E2E_DATABASE_CONTAINER;
const timeout = (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(15_000) });

async function readJson(response) { return response.json().catch(() => ({})); }

async function main() {
  if (!base || !password || !container) throw new Error('E2E_BASE_URL, ADMIN_BOOTSTRAP_PASSWORD, and E2E_DATABASE_CONTAINER are required');

  let browser;
  let context;
  const prisma = new PrismaClient();
  let original;
  try {
    console.error('step: login');
    const login = await timeout(`${base}/api/admin/auth`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) });
    const cookie = login.headers.get('set-cookie')?.split(';')[0];
    if (!login.ok || !cookie) throw new Error('Admin login failed');
    const headers = { cookie, 'content-type': 'application/json' };

    console.error('step: admin-read');
    const adminRead = await timeout(`${base}/api/admin/settings`, { headers });
    original = (await readJson(adminRead)).settings;
    if (!adminRead.ok || !original) throw new Error('Admin settings read failed');
    const changed = original.hotlines[1].replace(/(\d)(?!.*\d)/, (digit) => digit === '9' ? '8' : '9');
    const updated = { ...original, hotlines: [original.hotlines[0], changed] };

    console.error('step: admin-update');
    const update = await timeout(`${base}/api/admin/settings`, { method: 'PATCH', headers, body: JSON.stringify(updated) });
    if (!update.ok) throw new Error('Admin settings update failed');
    const stored = await prisma.globalSetting.findUnique({ where: { key: 'site_config' } });
    const directDb = stored?.value && typeof stored.value === 'object' && stored.value.hotlines?.[1] === changed;
    if (!directDb) throw new Error('Direct PostgreSQL value did not change');

    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    const page = await context.newPage();
    console.error('step: public-render');
    await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 15_000 });
    await page.getByText(changed, { exact: false }).first().waitFor({ state: 'visible', timeout: 8_000 });
    const phoneHref = `tel:${changed.replace(/\./g, '')}`;
    const phoneLink = page.locator(`a[href="${phoneHref}"]`).first();
    await phoneLink.waitFor({ state: 'visible', timeout: 8_000 });
    const rendered = await page.locator('body').innerText();
    const visible = rendered.includes(changed);
    const href = await phoneLink.getAttribute('href');

    console.error('step: reload');
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 15_000 });
    await page.getByText(changed, { exact: false }).first().waitFor({ state: 'visible', timeout: 8_000 });
    const reload = (await readJson(await timeout(`${base}/api/admin/settings`, { headers }))).settings;
    const persisted = reload?.hotlines?.[1] === changed;
    if (!visible || href !== phoneHref || !persisted) throw new Error('Public propagation assertion failed');

    console.error('step: restore');
    const restore = await timeout(`${base}/api/admin/settings`, { method: 'PATCH', headers, body: JSON.stringify(original) });
    if (!restore.ok) throw new Error('Original settings restore failed');

    console.error('step: db-down');
    execFileSync('docker', ['stop', container], { stdio: 'pipe' });
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 15_000 });
    const unavailable = await page.getByRole('status').filter({ hasText: 'Thông tin liên hệ tạm thời chưa khả dụng.' }).count();
    const downBody = await page.locator('body').innerText();
    const dbDownSafe = unavailable > 0 && !downBody.includes(original.hotlines[0]) && !downBody.includes(original.hotlines[1]) && !/Prisma|database error|P20\d\d/i.test(downBody);
    if (!dbDownSafe) throw new Error('Public DB-down fallback assertion failed');

    console.log(JSON.stringify({ login: login.status, update: update.status, directDb, publicVisible: visible, telHref: href, reload: persisted, restore: restore.status, dbDown: dbDownSafe }));
  } finally {
    await prisma.$disconnect();
    await context?.close();
    await browser?.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
