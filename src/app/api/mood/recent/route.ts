import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, value: 5, note: "Feeling great!", createdAt: new Date().toISOString() },
    { id: 2, value: 4, note: "Good day.", createdAt: new Date(Date.now() - 86400000).toISOString() },
  ]);
}
