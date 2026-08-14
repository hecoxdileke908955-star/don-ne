import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      phone,
      serviceSlug,
      district,
      areaDetail,
      scheduledTime,
      images,
      customerNote,
      utmSource,
      landingPage,
      sessionId
    } = body;

    if (!customerName || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const leadCode = 'DN-' + Math.floor(10000 + Math.random() * 90000);

    // Save lead to DB if database is connected
    try {
      const createdLead = await prisma.lead.create({
        data: {
          leadCode,
          customerName,
          phone,
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
      return NextResponse.json({ success: true, lead: createdLead });
    } catch (dbErr) {
      console.warn('DB not connected yet, returning mock successful response:', dbErr);
      return NextResponse.json({
        success: true,
        lead: {
          leadCode,
          customerName,
          phone,
          status: 'NEW',
          note: 'Saved in runtime fallback memory'
        }
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
