import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { enforceRateLimit } from '@/lib/rate-limit';

const MAX_REQUEST_BYTES = 8_192;
const trackPayloadSchema = z.object({
  sessionId: z.string().trim().min(4).max(200).regex(/^[A-Za-z0-9_-]+$/),
  eventName: z.enum(['phone_click', 'zalo_click', 'quote_form_submit']),
  pageUrl: z.string().trim().startsWith('/').max(500).default('/'),
  meta: z.object({
    device: z.enum(['MOBILE', 'DESKTOP', 'TABLET']).optional(),
    utmSource: z.string().trim().max(200).optional(),
    hotline: z.string().trim().max(30).optional(),
    zalo: z.string().trim().max(30).optional(),
    location: z.string().trim().max(100).optional(),
    service: z.string().trim().max(120).optional(),
    district: z.string().trim().max(120).optional(),
  }).strict().default({}),
}).strict();

async function parsePayload(request: Request) {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) return null;

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_REQUEST_BYTES) return null;

  try {
    return trackPayloadSchema.safeParse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const parsed = await parsePayload(request);
  if (!parsed || !parsed.success) return NextResponse.json({ error: 'Invalid event data' }, { status: 400 });

  const rateLimit = await enforceRateLimit(request, 'track');
  if (rateLimit.status === 'unavailable') return NextResponse.json({ error: 'Tracking temporarily unavailable' }, { status: 503 });
  if (rateLimit.status === 'limited') return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
  );

  const { sessionId, eventName, pageUrl, meta } = parsed.data;
  try {
    await prisma.$transaction([
      prisma.trafficSession.upsert({
        where: { sessionId },
        update: {},
        create: {
          sessionId,
          landingPage: pageUrl,
          utmSource: meta.utmSource ?? null,
          deviceType: meta.device ?? 'DESKTOP',
        },
      }),
      prisma.trafficEvent.create({
        data: { sessionId, eventName, pageUrl, meta },
      }),
    ]);
    return NextResponse.json({ tracked: true });
  } catch {
    return NextResponse.json({ error: 'Tracking temporarily unavailable' }, { status: 503 });
  }
}
