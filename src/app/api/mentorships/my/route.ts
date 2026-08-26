import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: "ms1",
      mentor: {
        id: "m1",
        name: "Aarav Mehta",
        department: "Computer Science"
      },
      status: "active",
      startDate: new Date(Date.now() - 604800000).toISOString(),
      nextMeeting: new Date(Date.now() + 86400000).toISOString()
    }
  ]);
}
