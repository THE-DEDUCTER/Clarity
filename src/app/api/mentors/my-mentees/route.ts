import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: "mentee_1",
      name: "Rohan Gupta",
      department: "Mechanical Engineering",
      year: "1st Year",
      lastInteraction: new Date(Date.now() - 86400000).toISOString(),
      status: "active"
    }
  ]);
}
