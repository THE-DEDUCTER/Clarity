import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { query, items, type } = await req.json();

    if (!query || !items) {
      return NextResponse.json({ error: 'Query and items are required' }, { status: 400 });
    }

    const { object } = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: z.object({
        recommendedId: z.string().describe('The ID of the most relevant item from the provided list.'),
        reasoning: z.string().describe('A brief, encouraging 1-sentence explanation of why this is perfect for them right now.'),
      }),
      system: `You are an AI wellness assistant. The user is looking for a ${type} recommendation based on their current feelings or situation. Choose the best match from the provided items JSON.`,
      prompt: `User situation: "${query}"\n\nAvailable items: ${JSON.stringify(items)}`,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error('Recommendation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendation' },
      { status: 500 }
    );
  }
}
