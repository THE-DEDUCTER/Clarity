import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, value: 4, date: new Date().toISOString() },
    { id: 2, value: 5, date: new Date(Date.now() - 86400000).toISOString() }
  ]);
}
