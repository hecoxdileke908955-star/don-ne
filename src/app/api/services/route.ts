import { NextResponse } from 'next/server';
import { getPublishedServices } from '@/lib/service-data';
export async function GET() { try { return NextResponse.json({ services: await getPublishedServices() }); } catch { return NextResponse.json({ error: 'Services temporarily unavailable' }, { status: 503 }); } }
