import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, eventName, pageUrl, meta } = body;

    if (!sessionId || !eventName) {
      return NextResponse.json({ error: 'Invalid event data' }, { status: 400 });
    }

    // Try saving event to DB if available
    try {
      await prisma.trafficSession.upsert({
        where: { sessionId },
        update: {},
        create: {
          sessionId,
          landingPage: pageUrl || '/',
          utmSource: meta?.utmSource || null,
          deviceType: meta?.device === 'MOBILE' ? 'MOBILE' : meta?.device === 'TABLET' ? 'TABLET' : 'DESKTOP',
        }
      });

      await prisma.trafficEvent.create({
        data: {
          sessionId,
          eventName,
          pageUrl: pageUrl || '/',
          meta: meta || {}
        }
      });
    } catch {
      // Background tracking graceful fallback
    }

    return NextResponse.json({ tracked: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Internal server error';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
