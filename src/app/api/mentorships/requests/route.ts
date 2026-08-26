import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([]);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      request: {
        id: "req_" + Date.now(),
        ...body,
        status: "pending",
        createdAt: new Date().toISOString()
      }
    });
  } catch {
    return NextResponse.json({ success: true });
  }
}
