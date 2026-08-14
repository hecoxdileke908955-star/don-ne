import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const quoteSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(30),
  serviceSlug: z.string().trim().min(1).max(120).optional(),
  district: z.string().trim().max(120).optional(),
  areaDetail: z.string().trim().max(500).optional(),
  scheduledTime: z.string().trim().max(200).optional(),
  images: z.array(z.string().regex(/^data:image\/(png|jpe?g|webp);base64,/).max(2_000_000)).max(5).optional(),
  customerNote: z.string().trim().max(2_000).optional(),
  utmSource: z.string().trim().max(200).optional(),
  landingPage: z.string().trim().startsWith('/').max(500).optional(),
  sessionId: z.string().trim().max(200).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = quoteSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'Invalid quote request' }, { status: 400 });
    const { customerName, phone, serviceSlug, district, areaDetail, scheduledTime, images, customerNote, utmSource, landingPage, sessionId } = parsed.data;
    if ((images?.reduce((total, image) => total + image.length, 0) ?? 0) > 5_000_000) return NextResponse.json({ error: 'Image payload is too large' }, { status: 400 });
    const service = serviceSlug ? await prisma.service.findUnique({ where: { slug: serviceSlug }, select: { id: true, title: true } }) : null;
    if (serviceSlug && !service) return NextResponse.json({ error: 'Unknown service' }, { status: 400 });

    const leadCode = 'DN-' + Math.floor(10000 + Math.random() * 90000);

    const createdLead = await prisma.lead.create({
      data: {
        leadCode,
        customerName,
        phone,
        serviceId: service?.id,
        serviceName: service?.title,
        district,
        estimatedArea: areaDetail,
        scheduledTime,
        imageUrls: images || [],
        customerNote,
        utmSource: utmSource || 'direct',
        landingPage: landingPage || '/',
        sessionId: sessionId || null,
      }
    });

    return NextResponse.json({
      success: true,
      leadCode: createdLead.leadCode,
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to save quote request' },
      { status: 500 }
    );
  }
}
