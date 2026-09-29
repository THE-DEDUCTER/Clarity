import { NextResponse } from 'next/server';

// ─── Personality system prompts ──────────────────────────────────────────────
const systemPrompts: Record<string, string> = {
  alex:
    "You are Alex, a calm, grounding wellness coach. Speak warmly, concisely (1-2 short sentences max), and with deep empathy. DO NOT start giving breathing exercises or long paragraphs unless the user specifically expresses stress, anxiety, or asks for help. If they just say 'hi', respond with a short, warm greeting and ask how their day is going.",
  maya:
    "You are Maya, an energetic, uplifting, and motivational buddy. Keep your responses short (1-2 sentences), encouraging, positive, and energizing. Do not preach or give long speeches.",
  sage:
    "You are Sage, a thoughtful, analytical companion. Help the user break down complex challenges. Keep responses under 3 sentences unless explaining a complex concept.",
  luna:
    "You are Luna, a gentle nighttime companion. Your tone is soft and soothing. Keep responses very short and peaceful.",
  rio:
    "You are Rio, a friendly, casual social buddy. Speak like a supportive friend in a text message (short, natural, no essays).",
};

// ─── Smart offline fallback ──────────────────────────────────────────────────
function generateSmartOfflineResponse(
  personalityId: string,
  message: string,
): string {
  const lower = message.toLowerCase();

  if (personalityId === 'alex') {
    if (
      lower.includes('anxious') ||
      lower.includes('stress') ||
      lower.includes('overwhelm') ||
      lower.includes('panic')
    ) {
      return "I hear the weight you're carrying right now. Let's take a slow breath together: inhale for 4 seconds, hold for 4, and exhale gently for 6. What is one small thing we can set aside for now?";
    }
    if (
      lower.includes('sad') ||
      lower.includes('lonely') ||
      lower.includes('depressed')
    ) {
      return "Thank you for sharing that with me. Please be gentle with yourself today — your feelings are valid, and you don't have to carry them alone.";
    }
    return "Thank you for reaching out. I'm here with you. What feels most important right now?";
  }

  if (personalityId === 'maya') {
    if (
      lower.includes('exam') ||
      lower.includes('study') ||
      lower.includes('procrastinat') ||
      lower.includes('work')
    ) {
      return "You've got this! Momentum starts with just 5 minutes of focused effort. What's our first micro-step?";
    }
    return "I love your energy in showing up today! Every step forward counts — I'm cheering you on! What's our goal today?";
  }

  if (personalityId === 'sage') {
    if (
      lower.includes('decision') ||
      lower.includes('confus') ||
      lower.includes('choice') ||
      lower.includes('problem')
    ) {
      return "Let's break this down. What factors are within your control vs. outside it? Separating the two often reveals the clearest path forward.";
    }
    return "Let's analyze this with clarity. What are the key elements of the situation you'd like to examine first?";
  }

  if (personalityId === 'luna') {
    if (
      lower.includes('sleep') ||
      lower.includes('insomnia') ||
      lower.includes('tired') ||
      lower.includes('night')
    ) {
      return "Let the events of the day drift away like clouds. Relax your shoulders and let your breath find its natural rhythm. You are safe. 🌙";
    }
    return "Releasing the tension of the day is a gift you give yourself. What would help you feel most rested right now?";
  }

  return "Hey! It's so good chatting with you! Tell me more about what's going on! 😊";
}

// ─── Shared message-mapping helper ───────────────────────────────────────────
function mapMessages(messages: any[]): { role: string; content: string }[] {
  return messages.map((m: any) => ({
    role:
      m.role === 'ai' || m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }));
}

// ─── Provider 1: Google Gemini ────────────────────────────────────────────────
async function tryGemini(
  systemPrompt: string,
  messages: any[],
): Promise<string | null> {
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return null;

  // Build Gemini contents array (system prompt injected as first user+model pair)
  const contents: { role: string; parts: { text: string }[] }[] = [];

  // Add system instruction via special field when using v1beta
  const mappedHistory = mapMessages(messages);
  for (const m of mappedHistory) {
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    });
  }

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      maxOutputTokens: 200,
      temperature: 0.7,
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[Gemini] ${res.status}: ${err}`);
    return null;
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  return text;
}

// ─── Provider 2: NVIDIA Nemotron (OpenAI-compatible) ─────────────────────────
async function tryNvidia(
  systemPrompt: string,
  messages: any[],
): Promise<string | null> {
  const apiKey =
    process.env.NVIDIA_API_KEY || process.env.NEXT_PUBLIC_NVIDIA_API_KEY;
  if (!apiKey) return null;

  const nvMessages = [
    { role: 'system', content: systemPrompt },
    ...mapMessages(messages),
  ];

  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'nvidia/nemotron-3-super-120b-a12b',
      messages: nvMessages,
      temperature: 0.5,
      top_p: 1,
      max_tokens: 200,
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[NVIDIA] ${res.status}: ${err}`);
    return null;
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? null;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, personalityId } = body;

    const systemPrompt =
      systemPrompts[personalityId] ?? 'You are a helpful wellness companion.';

    const lastUserMessage = Array.isArray(messages)
      ? messages.filter((m: any) => m.role === 'user').pop()?.content ?? ''
      : '';

    // 1️⃣ Gemini (primary)
    try {
      const geminiReply = await tryGemini(systemPrompt, messages);
      if (geminiReply) {
        return NextResponse.json({
          success: true,
          provider: 'gemini',
          message: geminiReply,
          response: geminiReply,
        });
      }
    } catch (e: any) {
      console.error('[Gemini] exception:', e.message);
    }

    // 2️⃣ NVIDIA Nemotron (fallback)
    try {
      const nvidiaReply = await tryNvidia(systemPrompt, messages);
      if (nvidiaReply) {
        return NextResponse.json({
          success: true,
          provider: 'nvidia',
          message: nvidiaReply,
          response: nvidiaReply,
        });
      }
    } catch (e: any) {
      console.error('[NVIDIA] exception:', e.message);
    }

    // 3️⃣ Smart offline fallback
    const offlineReply = generateSmartOfflineResponse(
      personalityId,
      lastUserMessage,
    );
    return NextResponse.json({
      success: true,
      provider: 'offline',
      message: offlineReply,
      response: offlineReply,
    });
  } catch (error: any) {
    console.error('[Chat Route] Unhandled error:', error);
    return NextResponse.json({
      success: true,
      provider: 'fallback',
      response:
        "I'm right here with you. Take a gentle breath and let me know how you're feeling.",
    });
  }
}
