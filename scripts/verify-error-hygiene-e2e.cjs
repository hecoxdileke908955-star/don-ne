const { execFileSync } = require('node:child_process');

const base = process.env.E2E_BASE_URL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const container = process.env.E2E_DATABASE_CONTAINER;
const request = (path, options = {}) => fetch(`${base}${path}`, {
  ...options,
  signal: AbortSignal.timeout(15_000),
});

async function json(response) {
  return response.json().catch(() => ({}));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function safeBody(body) {
  return !/(prisma|postgres|database|sql|p20\d\d|stack|[a-z]:\\|\/app\/|\/src\/)/i.test(JSON.stringify(body));
}

async function main() {
  if (!base || !password || !container) {
    throw new Error('E2E_BASE_URL, ADMIN_BOOTSTRAP_PASSWORD, and E2E_DATABASE_CONTAINER are required');
  }

  const login = await request('/api/admin/auth', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const loginBody = await json(login);
  const cookie = login.headers.get('set-cookie')?.split(';')[0];
  assert(login.ok && loginBody.success === true && cookie, 'Expected authenticated admin login');

  const adminHeaders = { cookie, origin: base, 'content-type': 'application/json' };
  const pricing = await request('/api/admin/pricing', { headers: { cookie } });
  const pricingBody = await json(pricing);
  assert(pricing.ok && pricingBody.items?.[0], 'Expected authenticated pricing read');

  const services = await request('/api/services');
  const servicesBody = await json(services);
  const serviceSlug = servicesBody.services?.[0]?.slug;
  assert(services.ok && serviceSlug, 'Expected public services read');

  const quotePayload = {
    customerName: 'Error Hygiene E2E',
    phone: '0900000000',
    serviceSlug,
    customerNote: 'Verifier-only record',
  };
  const quote = await request('/api/quote', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(quotePayload),
  });
  const quoteBody = await json(quote);
  assert(quote.ok && quoteBody.success === true && quoteBody.leadCode, 'Expected valid quote persistence');

  const leads = await request('/api/admin/leads', { headers: { cookie } });
  const leadsBody = await json(leads);
  const lead = leadsBody.leads?.find((entry) => entry.leadCode === quoteBody.leadCode);
  assert(leads.ok && lead, 'Expected persisted lead to be available to admin');

  const missingLead = await request('/api/admin/leads/00000000-0000-0000-0000-000000000000', {
    method: 'PATCH', headers: adminHeaders, body: JSON.stringify({ status: 'CONTACTED' }),
  });
  const missingLeadBody = await json(missingLead);
  assert(missingLead.status === 404 && safeBody(missingLeadBody), 'Expected generic not-found response for a missing lead');

  const foreignMutation = await request(`/api/admin/leads/${lead.id}`, {
    method: 'PATCH',
    headers: { ...adminHeaders, origin: 'https://attacker.example' },
    body: JSON.stringify({ status: 'CONTACTED' }),
  });
  const foreignMutationBody = await json(foreignMutation);
  assert(foreignMutation.status === 403 && safeBody(foreignMutationBody), 'Expected generic foreign-origin rejection');

  const wrongPasswordStatuses = [];
  for (let index = 0; index < 3; index += 1) {
    const response = await request('/api/admin/auth', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: 'invalid-password' }),
    });
    wrongPasswordStatuses.push(response.status);
    const body = await json(response);
    assert(safeBody(body), 'Expected generic authentication failure response');
  }
  assert(wrongPasswordStatuses[2] === 429, 'Expected generic rate-limit response');

  execFileSync('docker', ['stop', container], { stdio: 'pipe' });

  const downRequests = await Promise.all([
    request(`/api/admin/leads/${lead.id}`, {
      method: 'PATCH', headers: adminHeaders, body: JSON.stringify({ status: 'CONTACTED' }),
    }),
    request('/api/admin/pricing', { headers: { cookie } }),
    request('/api/services'),
    request('/api/quote', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(quotePayload),
    }),
    request('/api/track', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId: `errorhygiene${Date.now().toString(36)}`, eventName: 'phone_click', pageUrl: '/', meta: { device: 'DESKTOP' } }),
    }),
  ]);
  const downBodies = await Promise.all(downRequests.map(json));
  const downNames = ['leadPatch', 'pricingRead', 'servicesRead', 'quoteWrite', 'trackWrite'];
  const down = Object.fromEntries(downNames.map((name, index) => [name, {
    status: downRequests[index].status,
    safe: safeBody(downBodies[index]),
  }]));
  console.error(`step: db-down ${JSON.stringify(down)}`);
  assert(Object.values(down).every((result) => result.status === 503 && result.safe), 'Expected controlled generic 503 responses while database is down');

  console.log(JSON.stringify({
    login: login.status,
    services: services.status,
    quote: quote.status,
    missingLead: missingLead.status,
    foreignMutation: foreignMutation.status,
    wrongPasswordStatuses,
    down,
  }));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
