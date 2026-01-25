import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// SECURITY: Only use server-side environment variable (without NEXT_PUBLIC_ prefix)
// This ensures the API key is never exposed to the client-side bundle
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Add GEMINI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use available Gemini models (gemini-pro is deprecated)
    // Order: gemini-1.5-flash (fastest) -> gemini-1.5-pro (most capable) -> gemini-1.0-pro (fallback)
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'];
    let lastError: any = null;
    
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        return NextResponse.json({ text });
      } catch (error: any) {
        lastError = error;
        // If it's a 404 (model not found), try next model
        const errorMessage = error.message || error.toString() || '';
        if (
          errorMessage.includes('404') || 
          errorMessage.includes('not found') || 
          errorMessage.includes('is not found') ||
          errorMessage.includes('not supported')
        ) {
          console.log(`Model ${modelName} not available, trying next...`);
          continue;
        }
        // For other errors, throw immediately
        throw error;
      }
    }
    
    // If all models failed, throw the last error
    throw lastError || new Error('No available Gemini models found. Please check your API key and model availability.');
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}
