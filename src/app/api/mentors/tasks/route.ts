import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: "t1",
      title: "Schedule Weekly Check-in",
      menteeName: "Rohan Gupta",
      dueDate: new Date(Date.now() + 172800000).toISOString(),
      completed: false
    }
  ]);
}
