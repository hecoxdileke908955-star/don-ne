import { z } from 'zod';

const phoneSchema = z.string().trim().min(7).max(30).regex(/^[0-9+().\s-]+$/);
const urlSchema = z.string().trim().url().refine((value) => /^https?:\/\//.test(value));

export const siteConfigSchema = z.object({
  brandName: z.string().trim().min(1).max(120),
  slogan: z.string().trim().max(300),
  hotlines: z.array(phoneSchema).length(2),
  zaloNumbers: z.array(phoneSchema).length(2),
  emails: z.array(z.string().trim().email().max(254)).min(1).max(5),
  mainAddress: z.string().trim().min(1).max(400),
  branchAddresses: z.array(z.string().trim().min(1).max(400)).max(10),
  businessCode: z.string().trim().max(80),
  workingHours: z.string().trim().max(300),
  footerCommitment: z.string().trim().max(1_500),
  socials: z.object({
    facebook: urlSchema.optional(),
    tiktok: urlSchema.optional(),
  }),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
