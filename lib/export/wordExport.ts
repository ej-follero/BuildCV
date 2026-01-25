import { ResumeData } from '../types';
import { formatDate } from '../utils';

export function exportToWord(data: ResumeData): void {
  // Create HTML content for Word
  const htmlContent = generateWordHTML(data);
  
  // Create blob
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword',
  });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.personalInfo.firstName}_${data.personalInfo.lastName}_Resume.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function generateWordHTML(data: ResumeData): string {
  const { personalInfo, experiences, education, skills, projects } = data;
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resume - ${personalInfo.firstName} ${personalInfo.lastName}</title>
  <style>
    body {
      font-family: 'Calibri', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      margin: 1in;
      color: #000;
    }
    h1 {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 10pt;
      color: ${data.theme.primaryColor};
    }
    h2 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 16pt;
      margin-bottom: 8pt;
      border-bottom: 2pt solid ${data.theme.primaryColor};
      padding-bottom: 4pt;
    }
    h3 {
      font-size: 12pt;
      font-weight: bold;
      margin-top: 8pt;
      margin-bottom: 4pt;
    }
    .contact {
      font-size: 10pt;
      margin-bottom: 12pt;
    }
    .section {
      margin-bottom: 16pt;
    }
    .job-item, .edu-item {
      margin-bottom: 12pt;
    }
    .date {
      font-style: italic;
      color: #666;
    }
    .skills {
      margin-top: 8pt;
    }
    .skill-item {
      display: inline-block;
      margin-right: 8pt;
      margin-bottom: 4pt;
    }
  </style>
</head>
<body>
  <h1>${personalInfo.firstName} ${personalInfo.lastName}</h1>
  <div class="contact">
    ${personalInfo.email ? `${personalInfo.email} | ` : ''}
    ${personalInfo.phone ? `${personalInfo.phone} | ` : ''}
    ${personalInfo.location || ''}
    ${personalInfo.linkedin ? `<br>LinkedIn: ${personalInfo.linkedin}` : ''}
    ${personalInfo.github ? ` | GitHub: ${personalInfo.github}` : ''}
  </div>

  ${personalInfo.summary ? `
  <div class="section">
    <h2>Professional Summary</h2>
    <p>${personalInfo.summary}</p>
  </div>
  ` : ''}

  ${experiences.length > 0 ? `
  <div class="section">
    <h2>Professional Experience</h2>
    ${experiences.map(exp => `
      <div class="job-item">
        <h3>${exp.position}</h3>
        <div>${exp.company} • ${exp.location}</div>
        <div class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate || '')}</div>
        <p>${exp.description}</p>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${education.length > 0 ? `
  <div class="section">
    <h2>Education</h2>
    ${education.map(edu => `
      <div class="edu-item">
        <h3>${edu.degree} in ${edu.field}</h3>
        <div>${edu.institution} • ${edu.location}</div>
        <div class="date">${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate || '')}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
        ${edu.description ? `<p>${edu.description}</p>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${skills.length > 0 ? `
  <div class="section">
    <h2>Skills</h2>
    <div class="skills">
      ${skills.map(skill => `<span class="skill-item">${skill.name} (${skill.level})</span>`).join('')}
    </div>
  </div>
  ` : ''}

  ${projects && projects.length > 0 ? `
  <div class="section">
    <h2>Projects</h2>
    ${projects.map(project => `
      <div class="job-item">
        <h3>${project.name}${project.url ? ` - ${project.url}` : ''}</h3>
        <p>${project.description}</p>
        ${project.technologies.length > 0 ? `<div><strong>Technologies:</strong> ${project.technologies.join(', ')}</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}
</body>
</html>`;
}
