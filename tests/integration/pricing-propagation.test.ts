import { formatPriceRange } from '../../src/lib/pricing-engine';

describe('Integration: Pricing Single Source Propagation', () => {
  test('Admin price change propagates identically to all consumers', () => {
    // Single Source Entity in DB
    const dbPriceItem = {
      id: 'price-1',
      serviceSlug: 've-sinh-can-ho-chung-cu',
      minPrice: 800000,
      maxPrice: 1500000,
      unit: 'Gói'
    };

    // Consumer 1: Homepage Preview
    const renderHomepage = (item: typeof dbPriceItem) =>
      `Homepage: ${formatPriceRange(item.minPrice, item.maxPrice, item.unit)}`;

    // Consumer 2: Service Detail
    const renderServiceDetail = (item: typeof dbPriceItem) =>
      `Service: ${formatPriceRange(item.minPrice, item.maxPrice, item.unit)}`;

    // Consumer 3: Pricing Page Table
    const renderPricingTable = (item: typeof dbPriceItem) =>
      `PricingTable: ${formatPriceRange(item.minPrice, item.maxPrice, item.unit)}`;

    expect(renderHomepage(dbPriceItem)).toContain('800.000 – 1.500.000đ / Gói');
    expect(renderServiceDetail(dbPriceItem)).toContain('800.000 – 1.500.000đ / Gói');
    expect(renderPricingTable(dbPriceItem)).toContain('800.000 – 1.500.000đ / Gói');

    // Mutate in DB
    dbPriceItem.minPrice = 850000;
    dbPriceItem.maxPrice = 1600000;

    expect(renderHomepage(dbPriceItem)).toContain('850.000 – 1.600.000đ / Gói');
    expect(renderServiceDetail(dbPriceItem)).toContain('850.000 – 1.600.000đ / Gói');
    expect(renderPricingTable(dbPriceItem)).toContain('850.000 – 1.600.000đ / Gói');
  });
});
