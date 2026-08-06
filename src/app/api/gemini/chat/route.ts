import { NextRequest, NextResponse } from 'next/server';
import { ai, SYSTEM_STUDY_PROMPT } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history, contextType, contextTitle } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!ai) {
      return NextResponse.json({
        response: `[StudyOS AI Assistant]: Received query "${prompt}". Set GEMINI_API_KEY in .env.local for full Gemini responses.`
      });
    }

    // Build context history string for long-term AI memory
    let memoryContext = '';
    if (history && Array.isArray(history) && history.length > 0) {
      memoryContext = history
        .slice(-8) // Include last 8 turns for memory
        .map((m: any) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content || m.text}`)
        .join('\n');
    }

    const fullPrompt = `${SYSTEM_STUDY_PROMPT}\n\nContext Type: ${contextType || 'general'}\nActive Topic: ${contextTitle || 'General Study'}\n\nConversation Memory History:\n${memoryContext}\n\nCurrent Student Question: ${prompt}`;

    let responseText = '';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });
      responseText = response.text || '';
    } catch (err1: any) {
      console.warn('Gemini 2.5 Flash fallback to 2.0:', err1?.message);
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: fullPrompt,
        });
        responseText = response.text || '';
      } catch (err2: any) {
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-pro',
          contents: fullPrompt,
        });
        responseText = response.text || '';
      }
    }

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error('Gemini API Error details:', error);
    return NextResponse.json(
      { response: `Error from Gemini API: ${error?.message || 'Unknown error'}. Please verify key.` },
      { status: 500 }
    );
  }
}
