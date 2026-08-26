import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, date: new Date().toISOString(), score: 75, category: "Anxiety" },
    { id: 2, date: new Date(Date.now() - 86400000).toISOString(), score: 80, category: "Depression" }
  ]);
}
