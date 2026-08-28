import { NextResponse } from 'next/server';

const systemPrompts: Record<string, string> = {
  alex: "You are Alex, a calm, grounding mental wellness coach for students and young adults. Speak warmly, concisely, and with deep empathy. Guide the user with calming breathing exercises, stress management tips, and balanced perspective. Never provide clinical or medical diagnoses; always encourage healthy habits and professional help when appropriate.",
  maya: "You are Maya, an energetic, uplifting, and motivational buddy. Keep your responses encouraging, positive, and energizing. Help users overcome procrastination, celebrate small wins, and feel confident and capable.",
  sage: "You are Sage, a thoughtful, analytical companion. Help the user break down complex challenges, academic stress, or emotional dilemmas into structured, manageable steps with clarity and logic.",
  luna: "You are Luna, a gentle nighttime companion. Your tone is soft, soothing, and serene. Help the user unwind from a busy day, release tension, practice sleep hygiene, and find inner peace.",
  rio: "You are Rio, a friendly, casual social buddy. Help users navigate social anxiety, roommate conflicts, making friends, and building healthy relationships with warmth and natural humor.",
};

export async function POST(req: Request) {
  try {
    const { message, personalityId, conversationHistory } = await req.json();

    const apiKey = process.env.NUGEN_API_KEY || process.env.NEXT_PUBLIC_NUGEN_API_KEY;
    const apiUrl = process.env.NUGEN_API_URL || 'https://api.nugen.in/api/v3/inference/chat/completions';

    const systemPrompt = systemPrompts[personalityId] || "You are a helpful, empathetic mental wellness companion. Be concise, warm, and supportive.";

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        requiresKey: true,
        message: "NUGEN_API_KEY is not set in environment variables. Please add NUGEN_API_KEY to your .env.local file."
      }, { status: 401 });
    }

    const payload = {
      model: "model_conversation-bank-everyday-topics-llama-v3p2-3b-reasoning-aligned_alignment_01m13fd11eyw1a8",
      messages: [
        { role: "system", content: systemPrompt, name: "system" },
        ...(Array.isArray(conversationHistory) ? conversationHistory.slice(-6) : []),
        { role: "user", content: message }
      ],
      max_tokens: 200,
      prompt_truncate_len: 123,
      temperature: 1,
      stream: false // Set to false to avoid breaking frontend. Set to true if streaming is implemented.
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('NuGen API responded with error:', response.status, errText);
      return NextResponse.json({
        success: false,
        error: "NuGen API error: " + response.statusText
      }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || data.response || data.text || "I hear you, and I am here for you.";

    return NextResponse.json({
      success: true,
      provider: 'nugen',
      response: reply
    });

  } catch (error: any) {
    console.error('NuGen Chat Route Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to communicate with NuGen API' },
      { status: 500 }
    );
  }
}
