import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, mood: 4, label: "Good", timestamp: new Date().toISOString() },
    { id: 2, mood: 5, label: "Great", timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, mood: 3, label: "Okay", timestamp: new Date(Date.now() - 172800000).toISOString() },
  ]);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, mood: body, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ success: true });
  }
}
