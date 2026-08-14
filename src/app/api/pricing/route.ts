import { NextResponse } from 'next/server';
import { getPublicPriceItems } from '@/lib/pricing-data';

export async function GET() {
  try { return NextResponse.json({ items: await getPublicPriceItems() }); }
  catch { return NextResponse.json({ error: 'Pricing temporarily unavailable' }, { status: 503 }); }
}
