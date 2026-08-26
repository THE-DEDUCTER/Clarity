import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    reactions: [],
    count: 0
  });
}
