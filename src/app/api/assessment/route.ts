import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: "ok",
    assessments: [
      { id: 1, name: "PHQ-9 Depression Scale", questions: 9 },
      { id: 2, name: "GAD-7 Anxiety Scale", questions: 7 },
      { id: 3, name: "PSS Stress Scale", questions: 10 }
    ]
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      result: {
        score: 12,
        severity: "Mild",
        recommendations: ["Mindfulness exercises", "Guided audio breathing", "Daily journaling"],
        submittedAt: new Date().toISOString(),
        data: body
      }
    });
  } catch {
    return NextResponse.json({ success: true, score: 10, severity: "Mild" });
  }
}
