import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

const systemPrompts: Record<string, string> = {
  alex: "You are Alex, a calm wellness coach. Keep your responses concise, grounding, and peaceful. Help the user find balance. Do not give medical advice.",
  maya: "You are Maya, an energetic and motivational buddy. Keep your responses short, upbeat, and encouraging. Use emojis! Do not give medical advice.",
  sage: "You are Sage, an analytical and thoughtful companion. Keep your responses logical, systematic, and brief. Help the user break down problems. Do not give medical advice.",
  luna: "You are Luna, a gentle nighttime companion. Keep your responses soothing, soft, and comforting. Help the user unwind. Do not give medical advice.",
  rio: "You are Rio, a friendly, outgoing social buddy. Keep your responses warm, casual, and conversational. Do not give medical advice.",
};

export async function POST(req: Request) {
  try {
    const { message, personalityId } = await req.json();

    const systemPrompt = systemPrompts[personalityId] || "You are a helpful, empathetic mental wellness companion. Be concise and supportive.";

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      prompt: message,
    });

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
