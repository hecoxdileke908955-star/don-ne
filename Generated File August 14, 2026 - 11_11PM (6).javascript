import { validateSection } from '../../src/lib/section-schema';

describe('Visual Block Schema Validator Unit Tests', () => {
  test('validates valid Section Block props', () => {
    const validHero = {
      type: 'Hero',
      variant: 'default',
      order: 1,
      visible: true,
      props: {
        heading: 'Không Gian Sống',
        highlightWord: 'Sạch Tinh Tươm'
      }
    };
    const result = validateSection(validHero);
    expect(result.success).toBe(true);
  });

  test('rejects invalid section type', () => {
    const invalidType = {
      type: 'ArbitraryCustomHTMLInjection',
      variant: 'default',
      order: 1,
      visible: true,
      props: {}
    };
    const result = validateSection(invalidType);
    expect(result.success).toBe(false);
  });
});
