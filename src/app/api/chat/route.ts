import { NextResponse } from 'next/server';

const systemPrompts: Record<string, string> = {
  alex: "You are Alex, a calm, grounding wellness coach. Speak warmly, concisely, and with deep empathy. Guide the user with calming breathing exercises, stress management tips, and balanced perspective.",
  maya: "You are Maya, an energetic, uplifting, and motivational buddy. Keep your responses encouraging, positive, and energizing.",
  sage: "You are Sage, a thoughtful, analytical companion. Help the user break down complex challenges into structured, manageable steps.",
  luna: "You are Luna, a gentle nighttime companion. Your tone is soft, soothing, and serene. Help the user unwind and find peaceful rest.",
  rio: "You are Rio, a friendly, casual social buddy. Help users navigate social anxiety, friends, and everyday life with warmth.",
};

function generateSmartOfflineResponse(personalityId: string, message: string): string {
  const lower = message.toLowerCase();
  
  if (personalityId === "alex") {
    if (lower.includes("anxious") || lower.includes("stress") || lower.includes("overwhelm") || lower.includes("panic")) {
      return "I hear the weight you're carrying right now. Let's take a slow breath together: inhale for 4 seconds, hold for 4, and exhale gently for 6. You don't have to solve everything in this single moment. What is one small thing we can set aside for now?";
    }
    if (lower.includes("sad") || lower.includes("lonely") || lower.includes("depressed")) {
      return "Thank you for sharing that with me. It takes courage to acknowledge when things feel heavy. Please be gentle with yourself today. Remember that your feelings are valid, and you don't have to carry them alone. Would a grounding exercise feel helpful right now?";
    }
    return "Thank you for reaching out. I'm here to hold space for you in this moment. Taking things one gentle step at a time is always enough. What feels most important for you right now?";
  }

  if (personalityId === "maya") {
    if (lower.includes("exam") || lower.includes("study") || lower.includes("procrastinat") || lower.includes("work")) {
      return "You've got this! When a big goal feels daunting, remember: momentum starts with just 5 minutes of focused effort. Pick the smallest, easiest task first, conquer it, and celebrate that win! What's our first micro-step?";
    }
    return "I love your energy in showing up today! Every single step forward counts, no matter how small. Believe in what you're capable of—I'm cheering you on all the way! What's our goal today?";
  }

  if (personalityId === "sage") {
    if (lower.includes("decision") || lower.includes("confus") || lower.includes("choice") || lower.includes("problem")) {
      return "Let's break this down systematically. When we look at this challenge, what factors are directly within your control versus outside your control? By separating the two, we can formulate a clear, actionable plan.";
    }
    return "Let's analyze this with clarity. Taking a structured perspective often helps turn uncertainty into clarity. What are the key elements of the situation you'd like to examine first?";
  }

  if (personalityId === "luna") {
    if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("tired") || lower.includes("night")) {
      return "Let the events of the day drift away like clouds across the night sky. Relax your shoulders, unclamp your jaw, and let your breath find its natural gentle rhythm. You are safe, and tomorrow is a brand new day.";
    }
    return "Softly releasing the tension of the day is a gift you give to yourself. Sink into this peaceful moment. What would help you feel most rested and tranquil right now?";
  }

  return "Hey! It's so good chatting with you! Connecting with people and sharing what's on your mind makes everything feel a little lighter. I'm all ears—tell me more about what's going on!";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, personalityId } = body;

    // 1. Try NuGen API if key is present
    const nugenKey = process.env.NUGEN_API_KEY || process.env.NEXT_PUBLIC_NUGEN_API_KEY;
    if (nugenKey) {
      try {
        const nugenUrl = process.env.NUGEN_API_URL || 'https://api.nugen.ai/v1/chat/completions';
        const nugenRes = await fetch(nugenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + nugenKey,
            'x-api-key': nugenKey,
          },
          body: JSON.stringify({
            model: process.env.NUGEN_MODEL || 'nugen-chat-default',
            messages: [
              { role: "system", content: systemPrompts[personalityId] || "You are a wellness coach." },
              { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (nugenRes.ok) {
          const data = await nugenRes.json();
          const reply = data.choices?.[0]?.message?.content || data.response || data.text;
          if (reply) {
            return NextResponse.json({ success: true, provider: 'nugen', response: reply });
          }
        }
      } catch (err) {
        console.warn('NuGen attempt failed, trying fallback...', err);
      }
    }

    // 2. Try Gemini API if key is present
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (geminiKey) {
      try {
        const { google } = await import('@ai-sdk/google');
        const { generateText } = await import('ai');
        const { text } = await generateText({
          model: google('gemini-1.5-flash'),
          system: systemPrompts[personalityId] || "You are a helpful wellness companion.",
          prompt: message,
        });
        if (text) {
          return NextResponse.json({ success: true, provider: 'gemini', response: text });
        }
      } catch (err) {
        console.warn('Gemini attempt failed, using smart offline engine...', err);
      }
    }

    // 3. Smart Offline Persona Simulation Engine (Instant, 100% resilient response)
    const smartResponse = generateSmartOfflineResponse(personalityId, message);
    return NextResponse.json({
      success: true,
      provider: 'offline-smart-engine',
      response: smartResponse,
      note: 'To use live NuGen AI, set NUGEN_API_KEY in your .env.local file'
    });

  } catch (error: any) {
    console.error('Universal Chat Route Error:', error);
    return NextResponse.json({
      success: true,
      provider: 'fallback',
      response: "I'm right here with you. Take a gentle breath and let me know how you're feeling."
    });
  }
}
