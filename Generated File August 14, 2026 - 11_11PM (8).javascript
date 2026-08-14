import { formatVND, formatPriceRange, estimateServiceCost } from '../../src/lib/pricing-engine';

describe('Pricing Engine Unit Tests', () => {
  test('formatVND formats Vietnamese currency correctly', () => {
    const formatted = formatVND(800000);
    expect(formatted).toContain('800.000');
    expect(formatted).toContain('đ');
  });

  test('formatPriceRange formats single price or range with unit', () => {
    expect(formatPriceRange(15000, 25000, 'm²')).toBe('15.000 – 25.000đ / m²');
    const single = formatPriceRange(500000, 500000, 'bộ');
    expect(single).toContain('500.000');
    expect(single).toContain('/ bộ');
  });

  test('estimateServiceCost computes subtotal and discounts', () => {
    expect(estimateServiceCost(15000, 100, 0)).toBe(1500000);
    expect(estimateServiceCost(15000, 100, 10)).toBe(1350000);
  });
});
