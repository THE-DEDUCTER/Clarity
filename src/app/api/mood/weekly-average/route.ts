import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ average: 4.2 });
}
