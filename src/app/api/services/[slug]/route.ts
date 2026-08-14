import { NextResponse } from 'next/server';
import { getPublishedServiceBySlug } from '@/lib/service-data';
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) { try { const service = await getPublishedServiceBySlug((await params).slug); return service ? NextResponse.json({ service }) : NextResponse.json({ error: 'Not found' }, { status: 404 }); } catch { return NextResponse.json({ error: 'Services temporarily unavailable' }, { status: 503 }); } }
