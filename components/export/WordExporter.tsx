'use client';

import { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
// @ts-ignore - html-docx-js doesn't have proper TypeScript definitions
import htmlDocx from 'html-docx-js/dist/html-docx';

// Sanitize data helper - ensures all values are strings/primitives
function sanitizeData(data: ResumeData): ResumeData {
  return {
    personalInfo: {
      firstName: String(data?.personalInfo?.firstName || ''),
      lastName: String(data?.personalInfo?.lastName || ''),
      email: String(data?.personalInfo?.email || ''),
      phone: String(data?.personalInfo?.phone || ''),
      location: String(data?.personalInfo?.location || ''),
      website: String(data?.personalInfo?.website || ''),
      linkedin: String(data?.personalInfo?.linkedin || ''),
      github: String(data?.personalInfo?.github || ''),
      summary: String(data?.personalInfo?.summary || ''),
    },
    experiences: (data?.experiences || []).filter(exp => exp && typeof exp === 'object' && exp.id).map(exp => ({
      id: String(exp.id || ''),
      company: String(exp.company || ''),
      position: String(exp.position || ''),
      location: String(exp.location || ''),
      startDate: String(exp.startDate || ''),
      endDate: String(exp.endDate || ''),
      current: Boolean(exp.current),
      description: String(exp.description || ''),
    })),
    education: (data?.education || []).filter(edu => edu && typeof edu === 'object' && edu.id).map(edu => ({
      id: String(edu.id || ''),
      institution: String(edu.institution || ''),
      degree: String(edu.degree || ''),
      field: String(edu.field || ''),
      location: String(edu.location || ''),
      startDate: String(edu.startDate || ''),
      endDate: String(edu.endDate || ''),
      current: Boolean(edu.current),
      gpa: String(edu.gpa || ''),
      description: String(edu.description || ''),
    })),
    skills: (data?.skills || []).filter(skill => skill && typeof skill === 'object' && skill.id).map(skill => ({
      id: String(skill.id || ''),
      name: String(skill.name || ''),
      level: (skill.level || 'intermediate') as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    })),
    projects: (data?.projects || []).filter(project => project && typeof project === 'object' && project.id).map(project => ({
      id: String(project.id || ''),
      name: String(project.name || ''),
      description: String(project.description || ''),
      url: String(project.url || ''),
      technologies: Array.isArray(project.technologies) ? project.technologies.filter(Boolean).map((t: any) => String(t || '')) : [],
    })),
    theme: {
      template: (data?.theme?.template || 'modern') as 'minimalist' | 'modern' | 'creative',
      primaryColor: String(data?.theme?.primaryColor || '#3b82f6'),
      darkMode: Boolean(data?.theme?.darkMode),
    },
  };
}

// Generate Word HTML based on template
function generateWordHTML(data: ResumeData): string {
  const { personalInfo, experiences, education, skills, projects, theme } = data;
  const primaryColor = theme.primaryColor || '#3b82f6';
  
  // Escape HTML to prevent XSS (SSR-safe)
  const escapeHtml = (text: string): string => {
    if (typeof window === 'undefined') {
      // Server-side: use string replacement
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
    // Client-side: use DOM API
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const template = theme.template || 'modern';
  
  // Base styles for all templates
  let styles = `
    body {
      font-family: 'Calibri', 'Helvetica', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      margin: 0.75in;
      color: #000000;
    }
    h1 {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 8pt;
      color: ${primaryColor};
    }
    h2 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 16pt;
      margin-bottom: 8pt;
      border-bottom: 2pt solid ${primaryColor};
      padding-bottom: 4pt;
    }
    h3 {
      font-size: 12pt;
      font-weight: bold;
      margin-top: 8pt;
      margin-bottom: 4pt;
    }
    p {
      margin: 6pt 0;
      text-align: justify;
    }
    .contact-info {
      font-size: 10pt;
      margin-bottom: 12pt;
      color: #333333;
    }
    .section {
      margin-bottom: 16pt;
    }
    .job-item, .edu-item, .project-item {
      margin-bottom: 12pt;
    }
    .date {
      font-style: italic;
      color: #666666;
      font-size: 10pt;
    }
    .skills-list {
      margin-top: 8pt;
    }
    .skill-item {
      display: inline-block;
      margin-right: 8pt;
      margin-bottom: 4pt;
      padding: 2pt 6pt;
      background-color: #f0f0f0;
      border-radius: 3pt;
    }
    .summary {
      text-align: justify;
      line-height: 1.6;
    }
  `;

  // Template-specific styles
  if (template === 'minimalist') {
    styles += `
      h1 { text-align: center; }
      .contact-info { text-align: center; }
    `;
  } else if (template === 'modern') {
    styles += `
      h1 { border-bottom: 3pt solid ${primaryColor}; padding-bottom: 8pt; }
    `;
  } else if (template === 'creative') {
    styles += `
      h1 { 
        background-color: ${primaryColor};
        color: #ffffff;
        padding: 12pt;
        margin: -0.75in -0.75in 16pt -0.75in;
      }
    `;
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume - ${escapeHtml(personalInfo.firstName)} ${escapeHtml(personalInfo.lastName)}</title>
  <style>${styles}</style>
</head>
<body>
  <h1>${escapeHtml(personalInfo.firstName)} ${escapeHtml(personalInfo.lastName)}</h1>
  
  <div class="contact-info">
    ${personalInfo.email ? `${escapeHtml(personalInfo.email)}` : ''}
    ${personalInfo.phone ? ` | ${escapeHtml(personalInfo.phone)}` : ''}
    ${personalInfo.location ? ` | ${escapeHtml(personalInfo.location)}` : ''}
    ${personalInfo.linkedin ? `<br>LinkedIn: ${escapeHtml(personalInfo.linkedin)}` : ''}
    ${personalInfo.github ? ` | GitHub: ${escapeHtml(personalInfo.github)}` : ''}
    ${personalInfo.website ? ` | Website: ${escapeHtml(personalInfo.website)}` : ''}
  </div>

  ${personalInfo.summary ? `
  <div class="section">
    <h2>Professional Summary</h2>
    <p class="summary">${escapeHtml(personalInfo.summary)}</p>
  </div>
  ` : ''}

  ${experiences.length > 0 ? `
  <div class="section">
    <h2>Professional Experience</h2>
    ${experiences.map(exp => `
      <div class="job-item">
        <h3>${escapeHtml(exp.position)}</h3>
        <div><strong>${escapeHtml(exp.company)}</strong>${exp.location ? ` • ${escapeHtml(exp.location)}` : ''}</div>
        <div class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate || '')}</div>
        <p>${escapeHtml(exp.description)}</p>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${education.length > 0 ? `
  <div class="section">
    <h2>Education</h2>
    ${education.map(edu => `
      <div class="edu-item">
        <h3>${escapeHtml(edu.degree)} in ${escapeHtml(edu.field)}</h3>
        <div><strong>${escapeHtml(edu.institution)}</strong>${edu.location ? ` • ${escapeHtml(edu.location)}` : ''}</div>
        <div class="date">${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate || '')}${edu.gpa ? ` • GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
        ${edu.description ? `<p>${escapeHtml(edu.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${skills.length > 0 ? `
  <div class="section">
    <h2>Skills</h2>
    <div class="skills-list">
      ${skills.map(skill => `<span class="skill-item">${escapeHtml(skill.name)}</span>`).join('')}
    </div>
  </div>
  ` : ''}

  ${projects && projects.length > 0 ? `
  <div class="section">
    <h2>Projects</h2>
    ${projects.map(project => `
      <div class="project-item">
        <h3>${escapeHtml(project.name)}${project.url ? ` - ${escapeHtml(project.url)}` : ''}</h3>
        <p>${escapeHtml(project.description)}</p>
        ${project.technologies.length > 0 ? `<div><strong>Technologies:</strong> ${project.technologies.map(t => escapeHtml(t)).join(', ')}</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}
</body>
</html>`;

  return html;
}

export function WordExporter({ 
  data, 
  onSuccess 
}: { 
  data: ResumeData;
  onSuccess?: (filename: string) => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sanitizedData = useMemo(() => sanitizeData(data), [data]);
  
  // Generate filename: First_Last_CV.docx
  const generateFileName = (): string => {
    const firstName = sanitizedData.personalInfo.firstName || 'Resume';
    const lastName = sanitizedData.personalInfo.lastName || '';
    return lastName ? `${firstName}_${lastName}_CV.docx` : `${firstName}_CV.docx`;
  };

  // Early return if no personal info
  if (!data?.personalInfo?.firstName) {
    return (
      <Button disabled className="w-full" variant="outline">
        <FileText className="w-4 h-4 mr-2" />
        Add personal info first
      </Button>
    );
  }

  const handleDownload = async () => {
    if (!isMounted || isGenerating) return;

    try {
      setIsGenerating(true);
      
      // Generate HTML content
      const htmlContent = generateWordHTML(sanitizedData);
      
      // Convert HTML to Word document using html-docx-js
      // Set margins to 0.75 inches (1440 twentieths of a point = 1 inch, so 0.75 * 1440 = 1080)
      const converted = htmlDocx.asBlob(htmlContent, {
        orientation: 'portrait',
        margins: {
          top: 1080,    // 0.75 inches
          right: 1080,
          bottom: 1080,
          left: 1080,
        },
      });
      
      // Check file size (1MB max)
      if (converted.size > 1024 * 1024) {
        throw new Error('File size exceeds 1MB limit. Please reduce content.');
      }
      
      // Create download link
      const url = URL.createObjectURL(converted);
      const link = document.createElement('a');
      link.href = url;
      link.download = generateFileName();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      const filename = generateFileName();
      
      // Call success callback
      if (onSuccess) {
        onSuccess(filename);
      }
      
      return { success: true, filename };
    } catch (error: any) {
      console.error('Error generating Word document:', error);
      const errorMessage = error.message || 'Failed to generate Word document. Please try again.';
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isMounted) {
    return (
      <Button disabled className="w-full" variant="outline">
        <FileText className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isGenerating} 
      className="w-full"
      variant="outline"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4 mr-2" />
          Word (.docx)
        </>
      )}
    </Button>
  );
}
