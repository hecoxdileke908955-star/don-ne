const { PrismaClient } = require('@prisma/client');

const baseUrl = process.env.E2E_BASE_URL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const leadId = process.env.LEAD_E2E_ID;

async function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, options);
}

async function main() {
  const login = await request('/api/admin/auth', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) });
  const cookie = login.headers.get('set-cookie')?.split(';')[0];
  if (!login.ok || !cookie) throw new Error('Admin login or cookie capture failed');
  const headers = { cookie, 'content-type': 'application/json' };
  const unauthenticated = await request('/api/admin/leads');
  const before = await request('/api/admin/leads', { headers });
  const beforeLead = (await before.json()).leads.find(lead => lead.id === leadId);
  const patch = await request(`/api/admin/leads/${leadId}`, { method: 'PATCH', headers, body: JSON.stringify({ status: 'CONTACTED' }) });
  const after = await request('/api/admin/leads', { headers });
  const afterLead = (await after.json()).leads.find(lead => lead.id === leadId);
  const missing = await request('/api/admin/leads/00000000-0000-0000-0000-000000000000', { method: 'PATCH', headers, body: JSON.stringify({ status: 'CONTACTED' }) });
  const prisma = new PrismaClient();
  const dbLead = await prisma.lead.findUnique({ where: { id: leadId } });
  await prisma.$disconnect();
  console.log(JSON.stringify({ login: login.status, cookieCaptured: true, unauthenticated: unauthenticated.status, before: before.status, beforeStatus: beforeLead?.status, patch: patch.status, after: after.status, afterStatus: afterLead?.status, databaseStatus: dbLead?.status, nonexistent: missing.status }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
