import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

interface ParsedResumeData {
  name?: string;
  headline?: string;
  location?: string;
  summary?: string;
  experiences?: Array<{
    title: string;
    company: string;
    duration?: string;
    description?: string;
  }>;
  education?: Array<{
    school: string;
    degree?: string;
    field?: string;
  }>;
  skills?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Please upload a PDF file' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const pdfData = await pdf(buffer);
    const text = pdfData.text;

    const data: ParsedResumeData = {};

    // Split text into lines for better parsing
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Extract name (usually first significant line, 2-4 words, title case)
    const namePattern = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}$/;
    for (const line of lines.slice(0, 10)) {
      if (namePattern.test(line) && line.length < 50) {
        data.name = line;
        break;
      }
    }

    // Extract headline/summary (look for longer descriptive text)
    for (let i = 0; i < Math.min(20, lines.length); i++) {
      const line = lines[i];
      if (line.length > 20 && line.length < 150 && !data.headline) {
        // Skip if it looks like a section header
        if (!/^(experience|education|skills|summary|about|work|projects)/i.test(line)) {
          data.headline = line;
          data.summary = line;
          break;
        }
      }
    }

    // Extract location (look for city, state or country patterns)
    const locationPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:\s*,\s*[A-Z]{2})?)/;
    for (const line of lines.slice(0, 15)) {
      const match = line.match(locationPattern);
      if (match && match[0].length < 50) {
        data.location = match[0];
        break;
      }
    }

    // Extract experiences
    const experiences: ParsedResumeData['experiences'] = [];
    let inExperienceSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect experience section
      if (/^(experience|work\s+experience|employment|professional\s+experience)/i.test(line)) {
        inExperienceSection = true;
        continue;
      }
      
      // Detect end of experience section
      if (inExperienceSection && /^(education|skills|projects|summary|about)/i.test(line)) {
        inExperienceSection = false;
        continue;
      }
      
      if (inExperienceSection) {
        // Pattern: Job Title at Company or Company - Job Title
        const expMatch = line.match(/(.+?)\s+(?:at|@|\-|–|—)\s+(.+)/i) || 
                        line.match(/(.+?)\s+-\s+(.+)/);
        
        if (expMatch && expMatch[1].length < 80 && expMatch[2].length < 80) {
          experiences.push({
            title: expMatch[1].trim(),
            company: expMatch[2].trim(),
          });
          
          if (experiences.length >= 10) break;
        }
        
        // Alternative pattern: Just job title (if next line might be company)
        if (line.length > 5 && line.length < 60 && !line.includes('•') && 
            i + 1 < lines.length && experiences.length < 10) {
          const nextLine = lines[i + 1];
          if (nextLine && nextLine.length < 60 && !nextLine.match(/^\d{4}/)) {
            experiences.push({
              title: line,
              company: nextLine,
            });
            i++; // Skip next line
            if (experiences.length >= 10) break;
          }
        }
      }
    }

    // Extract education
    const education: ParsedResumeData['education'] = [];
    let inEducationSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect education section
      if (/^(education|academic|qualifications)/i.test(line)) {
        inEducationSection = true;
        continue;
      }
      
      // Detect end of education section
      if (inEducationSection && /^(experience|skills|projects|summary)/i.test(line)) {
        inEducationSection = false;
        continue;
      }
      
      if (inEducationSection) {
        // Pattern: School name, Degree
        const eduMatch = line.match(/(.+?)\s*,\s*(.+)/) ||
                        line.match(/(university|college|school|institute)/i);
        
        if (eduMatch) {
          const schoolMatch = line.match(/([A-Z][^,]+(?:University|College|School|Institute))/i);
          const degreeMatch = line.match(/(Bachelor|Master|PhD|B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|MBA)/i);
          
          if (schoolMatch || degreeMatch) {
            education.push({
              school: schoolMatch ? schoolMatch[1].trim() : line.split(',')[0].trim(),
              degree: degreeMatch ? degreeMatch[1].trim() : line.split(',')[1]?.trim() || '',
            });
            
            if (education.length >= 5) break;
          }
        }
      }
    }

    // Extract skills (look for skills section)
    const skills: string[] = [];
    let inSkillsSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (/^(skills|technical\s+skills|competencies)/i.test(line)) {
        inSkillsSection = true;
        continue;
      }
      
      if (inSkillsSection && /^(experience|education|projects|summary)/i.test(line)) {
        inSkillsSection = false;
        continue;
      }
      
      if (inSkillsSection) {
        // Skills are often comma-separated or bullet points
        const skillItems = line.split(/[,•·\-\s]+/).filter(s => s.trim().length > 2);
        for (const skill of skillItems) {
          const trimmed = skill.trim();
          if (trimmed.length > 2 && trimmed.length < 30 && !skills.includes(trimmed)) {
            skills.push(trimmed);
            if (skills.length >= 30) break;
          }
        }
        if (skills.length >= 30) break;
      }
    }

    data.experiences = experiences.length > 0 ? experiences : undefined;
    data.education = education.length > 0 ? education : undefined;
    data.skills = skills.length > 0 ? skills : undefined;

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('PDF parsing error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to parse PDF. Please ensure it contains readable text.',
        suggestion: 'Make sure the PDF is not scanned or password-protected. LinkedIn PDF exports should work perfectly.'
      },
      { status: 500 }
    );
  }
}
