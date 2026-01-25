import { ResumeData, ResumeScore, AISuggestion } from '../types';
import { callGeminiAPI } from './gemini';

// Google Gemini AI-powered resume analysis
// Free tier: 60 requests/minute, 1,500 requests/day
export async function analyzeResume(data: ResumeData): Promise<ResumeScore> {
  try {
    const resumeText = formatResumeForAnalysis(data);
    
    const prompt = `Analyze this resume and provide a detailed score and feedback. Return ONLY a JSON object with this exact structure:
{
  "overall": <number 0-100>,
  "grammar": <number 0-100>,
  "keywords": <number 0-100>,
  "formatting": <number 0-100>,
  "suggestions": ["suggestion1", "suggestion2", ...]
}

Resume content:
${resumeText}

Provide specific, actionable suggestions for improvement. Focus on ATS compatibility, keyword optimization, grammar, and formatting.`;

    const response = await callGeminiAPI(prompt);
    
    // Try to parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        overall: Math.max(0, Math.min(100, parsed.overall || 75)),
        grammar: Math.max(0, Math.min(100, parsed.grammar || 85)),
        keywords: Math.max(0, Math.min(100, parsed.keywords || 70)),
        formatting: Math.max(0, Math.min(100, parsed.formatting || 80)),
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : ['Resume analysis complete'],
      };
    }

    // Fallback if JSON parsing fails
    return fallbackAnalysis(data);
  } catch (error) {
    console.error('AI analysis error, using fallback:', error);
    return fallbackAnalysis(data);
  }
}

function formatResumeForAnalysis(data: ResumeData): string {
  return `
Name: ${data.personalInfo.firstName} ${data.personalInfo.lastName}
Email: ${data.personalInfo.email}
Summary: ${data.personalInfo.summary}

Experience:
${data.experiences.map(e => `- ${e.position} at ${e.company}: ${e.description}`).join('\n')}

Education:
${data.education.map(e => `- ${e.degree} in ${e.field} from ${e.institution}`).join('\n')}

Skills:
${data.skills.map(s => `${s.name} (${s.level})`).join(', ')}

Projects:
${data.projects?.map(p => `- ${p.name}: ${p.description}`).join('\n') || 'None'}
`.trim();
}

function fallbackAnalysis(data: ResumeData): ResumeScore {
  const suggestions: string[] = [];
  let score = 100;

  if (!data.personalInfo.summary || data.personalInfo.summary.length < 50) {
    score -= 10;
    suggestions.push('Add a professional summary (50+ characters)');
  }

  const commonKeywords = ['experience', 'skills', 'project', 'develop', 'manage', 'lead'];
  const resumeText = JSON.stringify(data).toLowerCase();
  const foundKeywords = commonKeywords.filter(kw => resumeText.includes(kw));
  if (foundKeywords.length < 3) {
    score -= 5;
    suggestions.push('Include more industry-relevant keywords');
  }

  const hasNumbers = /\d+/.test(data.experiences.map(e => e.description).join(' '));
  if (!hasNumbers) {
    score -= 10;
    suggestions.push('Add quantifiable achievements (numbers, percentages, metrics)');
  }

  if (data.experiences.length === 0) {
    score -= 20;
    suggestions.push('Add at least one work experience');
  }

  if (data.education.length === 0) {
    score -= 15;
    suggestions.push('Add education information');
  }

  if (data.skills.length < 5) {
    score -= 10;
    suggestions.push('Add more skills (aim for 5+)');
  }

  return {
    overall: Math.max(0, score),
    grammar: 95,
    keywords: Math.max(0, score - 20),
    formatting: 90,
    suggestions: suggestions.length > 0 ? suggestions : ['Resume looks great!'],
  };
}

export async function tailorToJobDescription(
  resumeData: ResumeData,
  jobDescription: string
): Promise<AISuggestion[]> {
  try {
    const resumeText = formatResumeForAnalysis(resumeData);
    
    const prompt = `Analyze this resume against the job description and provide specific tailoring suggestions. Return ONLY a JSON array of suggestions with this structure:
[
  {
    "type": "keyword" | "bullet" | "summary",
    "original": "<original text if applicable>",
    "suggestion": "<specific suggestion>",
    "reason": "<why this helps>"
  }
]

Resume:
${resumeText}

Job Description:
${jobDescription}

Focus on:
1. Missing keywords from the job description
2. Bullet points that could be improved to match job requirements
3. Skills or experiences that should be emphasized
4. Quantifiable achievements that could be added

Return maximum 10 suggestions.`;

    const response = await callGeminiAPI(prompt);
    
    // Try to parse JSON array from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 10) as AISuggestion[];
      }
    }

    // Fallback if parsing fails
    return fallbackTailoring(resumeData, jobDescription);
  } catch (error) {
    console.error('AI tailoring error, using fallback:', error);
    return fallbackTailoring(resumeData, jobDescription);
  }
}

function fallbackTailoring(
  resumeData: ResumeData,
  jobDescription: string
): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  const jdLower = jobDescription.toLowerCase();

  const keywords = extractKeywords(jdLower);
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  
  keywords.forEach(keyword => {
    if (!resumeText.includes(keyword.toLowerCase())) {
      suggestions.push({
        type: 'keyword',
        suggestion: `Consider adding "${keyword}" to your resume`,
        reason: `This keyword appears ${countOccurrences(jdLower, keyword)} times in the job description`,
      });
    }
  });

  resumeData.experiences.forEach(exp => {
    if (!exp.description.match(/\d+/)) {
      suggestions.push({
        type: 'bullet',
        original: exp.description,
        suggestion: `${exp.description} (Add specific metrics or numbers)`,
        reason: 'Quantifiable achievements stand out to ATS systems',
      });
    }
  });

  return suggestions.slice(0, 10);
}

export async function generateContentSuggestion(
  type: 'bullet' | 'summary',
  context: string,
  jobTitle?: string
): Promise<string> {
  try {
    let prompt = '';
    
    if (type === 'bullet') {
      prompt = `Generate a professional, impactful resume bullet point based on this context: "${context}". 
      
Requirements:
- Start with an action verb
- Include quantifiable metrics if possible
- Be specific and results-oriented
- Maximum 2 lines
- Return ONLY the bullet point text, no markdown formatting`;

    } else {
      prompt = `Generate a professional resume summary for a ${jobTitle || 'professional'} with this context: "${context}".
      
Requirements:
- 2-3 sentences
- Highlight key achievements and expertise
- Professional tone
- ATS-friendly
- Return ONLY the summary text, no markdown formatting`;
    }

    const response = await callGeminiAPI(prompt);
    
    // Clean up response (remove markdown, extra formatting)
    let cleaned = response.trim();
    cleaned = cleaned.replace(/^[•\-\*]\s*/, ''); // Remove bullet points
    cleaned = cleaned.replace(/^["']|["']$/g, ''); // Remove quotes
    cleaned = cleaned.split('\n')[0]; // Take first line
    
    if (cleaned.length > 0) {
      return cleaned;
    }

    // Fallback
    return fallbackContentSuggestion(type, context, jobTitle);
  } catch (error) {
    console.error('AI content generation error, using fallback:', error);
    return fallbackContentSuggestion(type, context, jobTitle);
  }
}

function fallbackContentSuggestion(
  type: 'bullet' | 'summary',
  context: string,
  jobTitle?: string
): string {
  if (type === 'bullet') {
    return `• ${context} resulting in measurable improvements and positive impact`;
  } else {
    return `Experienced ${jobTitle || 'professional'} with expertise in ${context}. Proven track record of delivering results and driving innovation.`;
  }
}

function extractKeywords(text: string): string[] {
  const commonTech = ['react', 'typescript', 'python', 'node', 'aws', 'docker', 'kubernetes'];
  const found = commonTech.filter(tech => text.includes(tech));
  return found.length > 0 ? found : ['leadership', 'collaboration', 'problem-solving'];
}

function countOccurrences(text: string, word: string): number {
  const regex = new RegExp(word, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}
