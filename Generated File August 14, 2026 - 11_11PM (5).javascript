import { resolveRedirect } from '../../src/lib/seo-redirects';

describe('SEO 301 Redirect Rules Unit Tests', () => {
  test('maps foreign seed URLs to canonical Vietnamese service URLs', () => {
    expect(resolveRedirect('/korean-house-cleaning-hanoi')).toBe('/ve-sinh-nha-cua');
    expect(resolveRedirect('/hanoi-mattress-cleaning-service')).toBe('/giat-dem');
    expect(resolveRedirect('/cam-nang-ve-sinh/')).toBe('/cam-nang');
  });

  test('returns null for standard canonical paths', () => {
    expect(resolveRedirect('/ve-sinh-nha-cua')).toBeNull();
  });
});
