import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, title: "Meditate for 10 mins", completed: true },
    { id: 2, title: "Write in diary", completed: false }
  ]);
}
