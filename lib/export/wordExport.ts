import { ResumeData } from '../types';
import { formatDate } from '../utils';
// @ts-ignore - html-docx-js doesn't have proper TypeScript definitions
import htmlDocx from 'html-docx-js/dist/html-docx';

/**
 * Legacy export function - kept for backward compatibility
 * Use WordExporter component instead for better integration
 */
export function exportToWord(data: ResumeData): void {
  // Generate HTML content
  const htmlContent = generateWordHTML(data);
  
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
  
  // Generate filename: First_Last_CV.docx
  const firstName = data.personalInfo.firstName || 'Resume';
  const lastName = data.personalInfo.lastName || '';
  const filename = lastName ? `${firstName}_${lastName}_CV.docx` : `${firstName}_CV.docx`;
  
  // Create download link
  const url = URL.createObjectURL(converted);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function generateWordHTML(data: ResumeData): string {
  const { personalInfo, experiences, education, skills, projects, theme } = data;
  const primaryColor = theme.primaryColor || '#3b82f6';
  
  // Escape HTML to prevent XSS
  const escapeHtml = (text: string): string => {
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
