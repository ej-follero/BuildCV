// Google Gemini AI integration
// Free tier: 60 requests/minute, 1,500 requests/day
// Get API key: https://makersuite.google.com/app/apikey

// Type declaration for dynamic import
type GoogleGenerativeAIModule = {
  GoogleGenerativeAI: new (apiKey: string) => {
    getGenerativeModel: (config: { model: string }) => {
      generateContent: (prompt: string) => Promise<{
        response: Promise<{ text: () => string }>;
      }>;
    };
  };
};

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export async function callGeminiAPI(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local');
  }

  try {
    // Use server-side API route to keep API key secure
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to call Gemini API');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// Fallback to client-side if API route is not available
export async function callGeminiClientSide(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    // Dynamic import with type assertion
    // @ts-expect-error - Dynamic import types may not be available during build
    const googleGenAI = await import('@google/generative-ai') as GoogleGenerativeAIModule;
    const { GoogleGenerativeAI } = googleGenAI;
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini client-side error:', error);
    throw error;
  }
}
