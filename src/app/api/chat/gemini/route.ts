import { NextResponse } from 'next/server';

const systemPrompts: Record<string, string> = {
  alex:  "You are Alex, a calm wellness coach. Keep responses concise, grounding, and peaceful. Help the user find balance. No medical advice.",
  maya:  "You are Maya, an energetic motivational buddy. Keep responses short, upbeat, and encouraging. Use emojis! No medical advice.",
  sage:  "You are Sage, an analytical companion. Keep responses logical, systematic, and brief. Help the user break down problems. No medical advice.",
  luna:  "You are Luna, a gentle nighttime companion. Keep responses soothing, soft, and comforting. No medical advice.",
  rio:   "You are Rio, a friendly social buddy. Keep responses warm, casual, and conversational. No medical advice.",
};

export async function POST(req: Request) {
  try {
    const { message, personalityId, messages } = await req.json();

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 },
      );
    }

    const systemPrompt =
      systemPrompts[personalityId] ??
      'You are a helpful, empathetic mental wellness companion. Be concise and supportive.';

    // Build contents: if full history is passed use it, otherwise single message
    const contents =
      Array.isArray(messages) && messages.length > 0
        ? messages.map((m: any) => ({
            role: m.role === 'assistant' || m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.content }],
          }))
        : [{ role: 'user', parts: [{ text: message ?? '' }] }];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[/api/chat/gemini] ${res.status}: ${err}`);
      return NextResponse.json(
        { error: `Gemini API error: ${res.status}` },
        { status: 502 },
      );
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error('[/api/chat/gemini] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 },
    );
  }
}
