import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// SECURITY: Only use server-side environment variable (without NEXT_PUBLIC_ prefix)
// This ensures the API key is never exposed to the client-side bundle
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key missing' }, { status: 500 });
    }

    const { prompt } = await request.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 });

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // 2026 FREE TIER MODELS (no 404 errors)
    const modelNames = [
      'gemini-2.5-flash',           // Fastest, free tier favorite
      'gemini-2.0-flash',           // Stable fallback
      'gemini-flash-latest',        // Latest stable flash
      'gemini-2.5-flash-lite',      // Ultra-lightweight
    ];

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`Used model: ${modelName}`);
        return NextResponse.json({ text, model: modelName });
      } catch (error: any) {
        const msg = error.message || '';
        if (msg.includes('404') || msg.includes('not found')) {
          console.log(`Skipping ${modelName}`);
          continue;
        }
        throw error; // Non-404 errors are real problems
      }
    }

    throw new Error('No working Gemini models available. Check API key.');
  } catch (error: any) {
    console.error('Gemini error:', error);
    return NextResponse.json(
      { error: error.message || 'AI service unavailable' },
      { status: 500 }
    );
  }
}
