import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminSession } from '@/lib/admin-authorization';

const phoneSchema = z.string().trim().min(7).max(30).regex(/^[0-9+().\s-]+$/);
const urlSchema = z.string().trim().url().refine((value) => /^https?:\/\//.test(value));

const siteConfigSchema = z.object({
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

async function readSettings() {
  const setting = await prisma.globalSetting.findUnique({ where: { key: 'site_config' } });
  if (!setting) return null;
  const parsed = siteConfigSchema.safeParse(setting.value);
  return parsed.success ? parsed.data : null;
}

export async function GET() {
  if (!await requireAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const settings = await readSettings();
    if (!settings) return NextResponse.json({ error: 'Settings temporarily unavailable' }, { status: 503 });
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: 'Settings temporarily unavailable' }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!await requireAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = siteConfigSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
  try {
    const setting = await prisma.globalSetting.upsert({
      where: { key: 'site_config' },
      create: { key: 'site_config', value: parsed.data },
      update: { value: parsed.data },
    });
    return NextResponse.json({ settings: setting.value });
  } catch {
    return NextResponse.json({ error: 'Settings temporarily unavailable' }, { status: 503 });
  }
}
