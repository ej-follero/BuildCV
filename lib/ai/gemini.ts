// Google Gemini AI integration
// Free tier: 60 requests/minute, 1,500 requests/day
// Get API key: https://makersuite.google.com/app/apikey
// 
// SECURITY: API key is stored server-side only. Never use NEXT_PUBLIC_ prefix
// for API keys as it exposes them to the client-side bundle.

export async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    // Always use server-side API route to keep API key secure
    // The API route uses GEMINI_API_KEY (without NEXT_PUBLIC_ prefix)
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
