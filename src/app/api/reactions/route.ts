import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ success: true, reactions: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, reaction: body, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ success: true });
  }
}
