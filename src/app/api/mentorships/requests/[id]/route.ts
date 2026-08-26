import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, ...body });
  } catch {
    return NextResponse.json({ success: true });
  }
}
