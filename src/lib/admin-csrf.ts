import 'server-only';

function normalizedOrigin(value: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.origin
      : null;
  } catch {
    return null;
  }
}

function originFromForwardedHeaders(request: Request): string | null {
  const protocol = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('x-forwarded-host');

  if (!protocol || !host || (protocol !== 'http' && protocol !== 'https')) {
    return null;
  }

  return normalizedOrigin(`${protocol}://${host}`);
}

function expectedOrigin(request: Request): string | null {
  const configuredOrigin = normalizedOrigin(process.env.APP_ORIGIN ?? null);
  if (configuredOrigin) return configuredOrigin;

  // Vercel supplies the client-facing host and protocol headers. Do not use
  // forwarded headers unless the deployment is known to be Vercel.
  if (process.env.VERCEL === '1') {
    return originFromForwardedHeaders(request);
  }

  // A self-hosted deployment must opt in only after its reverse proxy strips
  // client-supplied forwarding headers and sets its own trusted values.
  if (process.env.TRUST_PROXY_HEADERS === '1') {
    return originFromForwardedHeaders(request);
  }

  // Local development has no external proxy and needs no production override.
  if (process.env.NODE_ENV !== 'production') {
    return normalizedOrigin(request.url);
  }

  return null;
}

export function requireSameOriginMutation(request: Request): boolean {
  const expected = expectedOrigin(request);
  if (!expected) return false;

  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;

  const origin = normalizedOrigin(request.headers.get('origin'));
  if (origin) return origin === expected;

  // Browsers normally include Origin for mutations. Referer is a narrow
  // fallback for compatible same-origin browser requests; missing provenance
  // fails closed for cookie-authenticated state changes.
  return normalizedOrigin(request.headers.get('referer')) === expected;
}
