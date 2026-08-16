/**
 * P0 real Dọn Nè photography, keyed by Service.slug — shared by the
 * homepage ServiceGrid section and the /dich-vu archive so the mapping
 * only lives in one place. Services without an entry here render without
 * an image (never reuse another service's photo).
 */
export const SERVICE_IMAGES: Record<string, string> = {
  've-sinh-nha-cua': '/images/home/dn-service-01.jpeg',
  've-sinh-can-ho-chung-cu': '/images/home/dn-service-01-alt.jpeg',
  've-sinh-sau-xay-dung': '/images/home/dn-service-03.jpeg',
  've-sinh-van-phong': '/images/home/dn-service-04.jpeg',
  'giat-ghe-sofa': '/images/home/dn-service-05.jpeg',
  'giat-dem': '/images/home/dn-service-06.jpeg',
  'giat-tham-van-phong': '/images/home/dn-service-07.jpeg',
  'dich-vu-lau-kinh': '/images/home/dn-service-08.jpeg',
  've-sinh-san-pickleball': '/images/home/dn-service-09.jpeg',
};

export function getServiceImage(slug: string): string | undefined {
  return SERVICE_IMAGES[slug];
}
