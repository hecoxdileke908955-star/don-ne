const base = process.env.E2E_BASE_URL;

const expectedPaths = ['/', '/dich-vu', '/admin-login', '/admin/pricing', '/api/services'];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function inspect(path, headers = {}) {
  const response = await fetch(`${base}${path}`, {
    headers,
    redirect: 'manual',
    signal: AbortSignal.timeout(15_000),
  });
  const csp = response.headers.get('content-security-policy') ?? '';

  assert(csp, `${path}: CSP missing`);
  assert(csp.includes("object-src 'none'"), `${path}: object-src protection missing`);
  assert(csp.includes("frame-ancestors 'none'"), `${path}: frame-ancestors protection missing`);
  assert(csp.includes("base-uri 'self'"), `${path}: base-uri protection missing`);
  assert(!csp.includes('*'), `${path}: broad CSP wildcard present`);
  assert(!csp.includes("'unsafe-eval'"), `${path}: unsafe-eval present in production policy`);
  assert(!csp.includes("'unsafe-inline'"), `${path}: unsafe-inline present in production policy`);
  assert(response.headers.get('x-content-type-options') === 'nosniff', `${path}: nosniff missing`);
  assert(response.headers.get('referrer-policy') === 'strict-origin-when-cross-origin', `${path}: unexpected Referrer-Policy`);
  assert(response.headers.get('permissions-policy') === 'camera=(), microphone=(), geolocation=()', `${path}: unexpected Permissions-Policy`);

  return {
    path,
    status: response.status,
    hsts: response.headers.get('strict-transport-security'),
  };
}

async function main() {
  if (!base) throw new Error('E2E_BASE_URL is required');

  const results = [];
  for (const path of expectedPaths) results.push(await inspect(path));

  const forwardedHttps = await inspect('/', {
    'x-forwarded-proto': 'https',
    'x-forwarded-host': 'donne.test',
  });
  assert(forwardedHttps.hsts === 'max-age=31536000', 'Expected production HTTPS request to receive HSTS');
  assert(results.every((result) => result.hsts === null), 'Expected local HTTP requests not to receive HSTS');

  console.log(JSON.stringify({ results, forwardedHttps }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
