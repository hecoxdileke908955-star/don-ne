const { execFileSync } = require('node:child_process');
const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const base = process.env.E2E_BASE_URL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const databaseContainer = process.env.E2E_DATABASE_CONTAINER;

function requireEnvironment(value, name) {
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function main() {
  requireEnvironment(base, 'E2E_BASE_URL');
  requireEnvironment(password, 'ADMIN_BOOTSTRAP_PASSWORD');
  requireEnvironment(databaseContainer, 'E2E_DATABASE_CONTAINER');

  const login = await fetch(`${base}/api/admin/auth`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const cookie = login.headers.get('set-cookie')?.split(';')[0];
  if (!login.ok || !cookie) throw new Error('Admin login failed');
  console.error('verified admin session');

  const headers = { cookie, 'content-type': 'application/json' };
  const unauthenticatedPatch = await fetch(`${base}/api/admin/pricing/not-authorized`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (unauthenticatedPatch.status !== 401) throw new Error('Unauthorized pricing PATCH was not rejected');

  const publicSeedRead = await fetch(`${base}/api/pricing`);
  const publicSeedItems = (await publicSeedRead.json()).items;
  if (!publicSeedRead.ok || !publicSeedItems?.length) throw new Error('No public PriceItem available');
  const adminRead = await fetch(`${base}/api/admin/pricing`, { headers });
  const publicIds = new Set(publicSeedItems.map((candidate) => candidate.id));
  const item = (await adminRead.json()).items?.find((candidate) => publicIds.has(candidate.id));
  if (!adminRead.ok || !item) throw new Error('No published PriceItem available');

  const original = Number(item.minPrice);
  const changed = original + 137;
  const payload = {
    itemName: item.itemName,
    unit: item.unit,
    minPrice: changed,
    maxPrice: item.maxPrice === null ? null : Math.max(changed, Number(item.maxPrice)),
    conditionText: item.conditionText,
    note: item.note,
    sortOrder: item.sortOrder,
    status: item.status,
  };
  const patch = await fetch(`${base}/api/admin/pricing/${item.id}`, {
    method: 'PATCH', headers, body: JSON.stringify(payload),
  });
  if (!patch.ok) throw new Error(`Admin update failed with ${patch.status}`);
  console.error('verified admin update and PostgreSQL persistence');

  const prisma = new PrismaClient();
  const persisted = await prisma.priceItem.findUnique({ where: { id: item.id } });
  await prisma.$disconnect();
  if (!persisted || Number(persisted.minPrice) !== changed) throw new Error('PostgreSQL did not persist the admin update');

  const publicRead = await fetch(`${base}/api/pricing`);
  const publicItem = (await publicRead.json()).items?.find((candidate) => candidate.id === item.id);
  if (!publicRead.ok || Number(publicItem?.minPrice) !== changed) throw new Error('Public pricing API did not expose the persisted value');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(10_000);
  await page.goto(`${base}/bang-gia`, { waitUntil: 'domcontentloaded' });
  await page.getByText(item.itemName, { exact: true }).waitFor();
  const publicPriceVisible = await page.getByText(new Intl.NumberFormat('vi-VN').format(changed), { exact: false }).count();
  if (!publicPriceVisible) throw new Error('The public price table did not render the changed value');

  const calculator = page.locator('select');
  await calculator.selectOption(item.id);
  const calculatorText = await page.locator('.text-2xl.font-black.text-primary').textContent();
  const expectedCalculatorTotal = changed * (item.unit === 'm²' ? 75 : 1);
  if (!calculatorText?.includes(new Intl.NumberFormat('vi-VN').format(expectedCalculatorTotal))) throw new Error('PricingCalculator did not use the changed canonical value');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByText(item.itemName, { exact: true }).waitFor();
  const reloadedPublicPriceVisible = await page.getByText(new Intl.NumberFormat('vi-VN').format(changed), { exact: false }).count();
  if (!reloadedPublicPriceVisible) throw new Error('Changed price was not retained after reload');
  console.error('verified public table, calculator, and reload');

  execFileSync('docker', ['stop', databaseContainer], { stdio: 'pipe' });
  console.error('stopped disposable database');
  const downApi = await fetch(`${base}/api/pricing`);
  const downBody = await downApi.text();
  if (downApi.status !== 503 || downBody.includes(item.itemName) || downBody.includes(String(changed))) throw new Error('DB-down public API returned stale or successful pricing');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByText('Bảng giá tạm thời chưa khả dụng.', { exact: true }).first().waitFor();
  await browser.close();

  console.log(JSON.stringify({
    itemId: item.id, itemName: item.itemName, original, changed,
    adminPatch: patch.status, persisted: Number(persisted.minPrice),
    publicApi: publicRead.status, publicTable: 'rendered', calculator: calculatorText,
    reload: 'rendered', unauthenticatedPatch: unauthenticatedPatch.status,
    dbDownApi: downApi.status, dbDownPublic: 'unavailable',
  }));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
