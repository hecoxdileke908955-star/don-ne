export interface RedirectRule {
  oldPath: string;
  newPath: string;
  httpCode: number;
}

export const KNOWN_301_REDIRECTS: Record<string, string> = {
  '/korean-house-cleaning-hanoi': '/ve-sinh-nha-cua',
  '/korean-mattress-cleaning-hanoi': '/giat-dem',
  '/korean-sofa-cleaning-hanoi': '/giat-ghe-sofa',
  '/korean-home-carpet-cleaning-hanoi': '/giat-tham-van-phong',
  '/hanoi-house-cleaning-service': '/ve-sinh-nha-cua',
  '/hanoi-mattress-cleaning-service': '/giat-dem',
  '/hanoi-sofa-cleaning-service': '/giat-ghe-sofa',
  '/khu-vuc-phuc-vu': '/khu-vuc',
  '/cam-nang-ve-sinh': '/cam-nang',
};

export function resolveRedirect(path: string): string | null {
  const cleanPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
  return KNOWN_301_REDIRECTS[cleanPath] || null;
}
