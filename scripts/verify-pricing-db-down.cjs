const { execFileSync } = require('node:child_process');
const base = process.env.E2E_BASE_URL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const container = process.env.E2E_DB_CONTAINER;

async function main() {
  const login = await fetch(`${base}/api/admin/auth`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) });
  const cookie = login.headers.get('set-cookie')?.split(';')[0];
  const read = await fetch(`${base}/api/admin/pricing`, { headers: { cookie } });
  const readBody = await read.json();
  if (!read.ok || !readBody.items?.[0]) throw new Error(`Pre-down pricing read failed: ${read.status} ${JSON.stringify(readBody)}`);
  const item = readBody.items[0];
  execFileSync('docker', ['stop', container], { stdio: 'ignore' });
  const headers = { cookie, 'content-type': 'application/json' };
  const payload = { itemName: item.itemName, unit: item.unit, minPrice: Number(item.minPrice) + 1, maxPrice: item.maxPrice === null ? null : Number(item.maxPrice), conditionText: item.conditionText, note: item.note, sortOrder: item.sortOrder, status: item.status };
  const patch = await fetch(`${base}/api/admin/pricing/${item.id}`, { method: 'PATCH', headers, body: JSON.stringify(payload) });
  const get = await fetch(`${base}/api/admin/pricing`, { headers: { cookie } });
  console.log(JSON.stringify({ patchStatus: patch.status, patchBody: await patch.text(), getStatus: get.status, getBody: await get.text() }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
