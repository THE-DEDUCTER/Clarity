import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const { object } = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: z.object({
        mood: z.number().min(1).max(5).describe('The mood score from 1 (Very Low/Sad/Angry) to 5 (Great/Happy/Joyful).'),
        traumaLevel: z.number().min(1).max(5).describe('The stress or trauma level from 1 (Minimal/Calm) to 5 (Severe/Panic).'),
        triggers: z.array(z.string()).describe('List of potential triggers or stressful subjects mentioned, if any.'),
        categories: z.array(z.string()).describe('2 to 4 categories that fit this entry (e.g., "Work", "Relationships", "Anxiety", "Gratitude").'),
        insights: z.string().describe('A brief, empathetic, 1-2 sentence reflection or insight about the entry to help the user feel heard.'),
      }),
      system: 'You are an empathetic, psychological analysis AI. Analyze the given diary entry and extract the requested fields. Be extremely gentle and supportive in your insights. If the entry is very short or neutral, provide a neutral score (3) and a generic supportive insight.',
      prompt: content,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error('Diary Analysis Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze diary entry' },
      { status: 500 }
    );
  }
}
