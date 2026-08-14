import 'server-only';

import { prisma } from '@/lib/db';
import { siteConfigSchema, type SiteConfig } from '@/lib/site-config-schema';

export async function getPublicSiteConfig(): Promise<SiteConfig | null> {
  try {
    const setting = await prisma.globalSetting.findUnique({ where: { key: 'site_config' } });
    if (!setting) return null;

    const parsed = siteConfigSchema.safeParse(setting.value);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
