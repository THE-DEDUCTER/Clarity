import { NextResponse } from 'next/server';

const systemPrompts: Record<string, string> = {
  alex: "You are Alex, a calm, grounding wellness coach. Speak warmly, concisely (1-2 short sentences max), and with deep empathy. DO NOT start giving breathing exercises or long paragraphs unless the user specifically expresses stress, anxiety, or asks for help. If they just say 'hi', respond with a short, warm greeting and ask how their day is going.",
  maya: "You are Maya, an energetic, uplifting, and motivational buddy. Keep your responses short (1-2 sentences), encouraging, positive, and energizing. Do not preach or give long speeches.",
  sage: "You are Sage, a thoughtful, analytical companion. Help the user break down complex challenges. Keep responses under 3 sentences unless explaining a complex concept.",
  luna: "You are Luna, a gentle nighttime companion. Your tone is soft and soothing. Keep responses very short and peaceful.",
  rio: "You are Rio, a friendly, casual social buddy. Speak like a supportive friend in a text message (short, natural, no essays).",
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
    const { messages, personalityId } = body;
    
    // Safely extract the last user message for the fallback engine
    const lastUserMessage = Array.isArray(messages) 
      ? messages.filter(m => m.role === 'user').pop()?.content || ""
      : "";

    // 1. Try NuGen API if key is present
    const nugenKey = process.env.NUGEN_API_KEY || process.env.NEXT_PUBLIC_NUGEN_API_KEY;
    if (nugenKey) {
      try {
        const nugenUrl = 'https://api.nugen.in/api/v3/inference/chat/completions';
        
        const systemMessage = { 
          role: "system", 
          content: systemPrompts[personalityId] || "You are a wellness coach.",
          name: "system"
        };
        
        // Use the full message history from the frontend, ensuring we map 'ai' to 'assistant' for Nugen compatibility
        const mappedHistory = Array.isArray(messages) ? messages.map((m: any) => ({
          role: m.role === 'ai' || m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })) : [{ role: "user", content: lastUserMessage }];

        const nugenMessages = [
          systemMessage,
          ...mappedHistory
        ];
        
        const payload = {
          model: "model_conversation-bank-everyday-topics-llama-v3p2-3b-reasoning-aligned_alignment_01m13fd11eyw1a8",
          messages: nugenMessages,
          max_tokens: 200,
          prompt_truncate_len: 123,
          temperature: 0.6,
          stream: false
        };

        const nugenRes = await fetch(nugenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + nugenKey,
          },
          body: JSON.stringify(payload),
        });

        if (nugenRes.ok) {
          const data = await nugenRes.json();
          const reply = data.choices?.[0]?.message?.content || data.response || data.text;
          if (reply) {
            return NextResponse.json({ success: true, provider: 'nugen', message: reply, response: reply });
          } else {
            return NextResponse.json({ success: false, provider: 'nugen', message: `NuGen API returned 200 but format was unexpected: ${JSON.stringify(data)}`, response: `NuGen API returned 200 but format was unexpected: ${JSON.stringify(data)}` });
          }
        } else {
          const errText = await nugenRes.text();
          console.error(`NuGen API Error! Status: ${nugenRes.status}, Body: ${errText}`);
          return NextResponse.json({ success: false, provider: 'nugen', message: `NuGen API Error: ${nugenRes.status} - ${errText}`, response: `NuGen API Error: ${nugenRes.status} - ${errText}` });
        }
      } catch (err: any) {
        console.error('NuGen attempt failed with exception:', err);
        return NextResponse.json({ success: false, provider: 'nugen', message: `NuGen Exception: ${err.message}`, response: `NuGen Exception: ${err.message}` });
      }
    } else {
      return NextResponse.json({ success: false, provider: 'nugen', message: "NUGEN_API_KEY is missing from environment variables.", response: "NUGEN_API_KEY is missing from environment variables." });
    }


  } catch (error: any) {
    console.error('Universal Chat Route Error:', error);
    return NextResponse.json({
      success: true,
      provider: 'fallback',
      response: "I'm right here with you. Take a gentle breath and let me know how you're feeling."
    });
  }
}
