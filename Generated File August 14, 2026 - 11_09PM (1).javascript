import { z } from 'zod';

export const SectionTypeSchema = z.enum([
  'Hero',
  'ServiceGrid',
  'PricingPreview',
  'BeforeAfter',
  'ImageText',
  'Process',
  'Trust',
  'FAQ',
  'ArticleGrid',
  'ServiceAreas',
  'CTA',
  'ContactForm',
  'Stats'
]);

export type SectionType = z.infer<typeof SectionTypeSchema>;

export const SectionPropsSchema = z.object({
  id: z.string().optional(),
  type: SectionTypeSchema,
  variant: z.string().default('default'),
  order: z.number().default(0),
  visible: z.boolean().default(true),
  props: z.record(z.any()),
});

export type SectionData = z.infer<typeof SectionPropsSchema>;

export function validateSection(data: unknown): { success: boolean; data?: SectionData; error?: string } {
  const result = SectionPropsSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.message };
  }
  return { success: true, data: result.data };
}
