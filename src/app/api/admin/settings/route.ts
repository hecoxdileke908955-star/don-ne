import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminSession } from '@/lib/admin-authorization';
import { siteConfigSchema } from '@/lib/site-config-schema';

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
