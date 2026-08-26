import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    counts: { like: 0, heart: 0, helpful: 0, support: 0, thumbsup: 0 },
    total: 0
  });
}
