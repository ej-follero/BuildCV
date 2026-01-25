import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { ResumeData } from '@/lib/types';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #3b82f6',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contact: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2,
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3b82f6',
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  company: {
    fontSize: 10,
    color: '#666',
    marginBottom: 3,
  },
  date: {
    fontSize: 9,
    color: '#666',
    marginBottom: 3,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.4,
    marginTop: 3,
  },
  skillItem: {
    fontSize: 10,
    marginBottom: 3,
  },
});

// Deep sanitize helper - removes React elements and ensures JSON serializability
function deepSanitizeServer(value: any): any {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return '';
  }
  
  // Handle primitives
  if (typeof value !== 'object') {
    return value;
  }
  
  // Handle React elements (check for React element markers)
  if (value.$$typeof || value._owner || value._store) {
    return '';
  }
  
  // Handle Date objects
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(item => deepSanitizeServer(item)).filter(item => item !== null && item !== undefined);
  }
  
  // Handle plain objects
  const sanitized: any = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      // Skip React internal properties
      if (key.startsWith('_') || key.startsWith('$')) {
        continue;
      }
      const sanitizedValue = deepSanitizeServer(value[key]);
      if (sanitizedValue !== null && sanitizedValue !== undefined) {
        sanitized[key] = sanitizedValue;
      }
    }
  }
  return sanitized;
}

// Helper function to safely format dates
function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return String(dateString);
    }
    return date.toLocaleDateString();
  } catch {
    return String(dateString);
  }
}

function ResumePDF({ data }: { data: ResumeData }) {
  if (!data || typeof data !== 'object') {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View><Text>Invalid data</Text></View>
        </Page>
      </Document>
    );
  }

  const { personalInfo, experiences, education, skills, projects } = data;
  
  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  const safeEducation = Array.isArray(education) ? education : [];
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  const safePersonalInfo = {
    firstName: String(personalInfo && typeof personalInfo === 'object' ? personalInfo.firstName || '' : ''),
    lastName: String(personalInfo && typeof personalInfo === 'object' ? personalInfo.lastName || '' : ''),
    email: String(personalInfo && typeof personalInfo === 'object' ? personalInfo.email || '' : ''),
    phone: String(personalInfo && typeof personalInfo === 'object' ? personalInfo.phone || '' : ''),
    location: String(personalInfo && typeof personalInfo === 'object' ? personalInfo.location || '' : ''),
    summary: String(personalInfo && typeof personalInfo === 'object' ? personalInfo.summary || '' : ''),
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {safePersonalInfo.firstName} {safePersonalInfo.lastName}
          </Text>
          {safePersonalInfo.email && <Text style={styles.contact}>{safePersonalInfo.email}</Text>}
          {safePersonalInfo.phone && <Text style={styles.contact}>{safePersonalInfo.phone}</Text>}
          {safePersonalInfo.location && <Text style={styles.contact}>{safePersonalInfo.location}</Text>}
        </View>

        {safePersonalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.description}>{safePersonalInfo.summary}</Text>
          </View>
        )}

        {safeExperiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {safeExperiences.map((exp, idx) => (
              <View key={String(exp.id || `exp-${idx}`)} style={{ marginBottom: 10 }}>
                <Text style={styles.jobTitle}>{String(exp.position || '')}</Text>
                <Text style={styles.company}>
                  {String(exp.company || '')} • {String(exp.location || '')}
                </Text>
                <Text style={styles.date}>
                  {formatDate(String(exp.startDate || ''))} - {exp.current ? 'Present' : formatDate(String(exp.endDate || ''))}
                </Text>
                <Text style={styles.description}>{String(exp.description || '')}</Text>
              </View>
            ))}
          </View>
        )}

        {safeEducation.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {safeEducation.map((edu, idx) => (
              <View key={String(edu.id || `edu-${idx}`)} style={{ marginBottom: 8 }}>
                <Text style={styles.jobTitle}>
                  {String(edu.degree || '')} in {String(edu.field || '')}
                </Text>
                <Text style={styles.company}>
                  {String(edu.institution || '')} • {String(edu.location || '')}
                </Text>
                <Text style={styles.date}>
                  {formatDate(String(edu.startDate || ''))} - {edu.current ? 'Present' : formatDate(String(edu.endDate || ''))}
                  {edu.gpa ? ` • GPA: ${String(edu.gpa)}` : ''}
                </Text>
                {edu.description && <Text style={styles.description}>{String(edu.description)}</Text>}
              </View>
            ))}
          </View>
        )}

        {safeSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {safeSkills.map((skill, idx) => (
              <Text key={String(skill.id || `skill-${idx}`)} style={styles.skillItem}>
                {String(skill.name || '')} ({String(skill.level || '')})
              </Text>
            ))}
          </View>
        )}

        {safeProjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {safeProjects.map((project, idx) => (
              <View key={String(project.id || `project-${idx}`)} style={{ marginBottom: 8 }}>
                <Text style={styles.jobTitle}>{String(project.name || '')}</Text>
                <Text style={styles.description}>{String(project.description || '')}</Text>
                {project.technologies && project.technologies.length > 0 && (
                  <Text style={styles.date}>
                    Technologies: {project.technologies.map(t => String(t)).join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json();
    
    // Triple-sanitized data (JSON roundtrip kills React elements)
    const sanitizedData = JSON.parse(JSON.stringify(rawData)) as ResumeData;
    
    // Ensure all values are strings/primitives
    const finalData: ResumeData = {
      personalInfo: {
        firstName: String(sanitizedData?.personalInfo?.firstName || ''),
        lastName: String(sanitizedData?.personalInfo?.lastName || ''),
        email: String(sanitizedData?.personalInfo?.email || ''),
        phone: String(sanitizedData?.personalInfo?.phone || ''),
        location: String(sanitizedData?.personalInfo?.location || ''),
        website: String(sanitizedData?.personalInfo?.website || ''),
        linkedin: String(sanitizedData?.personalInfo?.linkedin || ''),
        github: String(sanitizedData?.personalInfo?.github || ''),
        summary: String(sanitizedData?.personalInfo?.summary || ''),
      },
      experiences: (sanitizedData?.experiences || [])
        .filter((exp: any) => {
          // Filter out React elements and ensure it's a plain object
          if (!exp || typeof exp !== 'object') return false;
          if (exp.$$typeof || exp._owner || exp._store) return false;
          return exp.id !== undefined;
        })
        .map((exp: any) => ({
          id: String(exp.id || ''),
          company: String(exp.company || ''),
          position: String(exp.position || ''),
          location: String(exp.location || ''),
          startDate: String(exp.startDate || ''),
          endDate: String(exp.endDate || ''),
          current: Boolean(exp.current),
          description: String(exp.description || ''),
        })),
      education: (sanitizedData?.education || [])
        .filter((edu: any) => {
          // Filter out React elements and ensure it's a plain object
          if (!edu || typeof edu !== 'object') return false;
          if (edu.$$typeof || edu._owner || edu._store) return false;
          return edu.id !== undefined;
        })
        .map((edu: any) => ({
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
      skills: (sanitizedData?.skills || [])
        .filter((skill: any) => {
          // Filter out React elements and ensure it's a plain object
          if (!skill || typeof skill !== 'object') return false;
          if (skill.$$typeof || skill._owner || skill._store) return false;
          return skill.id !== undefined;
        })
        .map((skill: any) => ({
          id: String(skill.id || ''),
          name: String(skill.name || ''),
          level: String(skill.level || 'intermediate') as 'beginner' | 'intermediate' | 'advanced' | 'expert',
        })),
      projects: (sanitizedData?.projects || [])
        .filter((project: any) => {
          // Filter out React elements and ensure it's a plain object
          if (!project || typeof project !== 'object') return false;
          if (project.$$typeof || project._owner || project._store) return false;
          return project.id !== undefined;
        })
        .map((project: any) => ({
          id: String(project.id || ''),
          name: String(project.name || ''),
          description: String(project.description || ''),
          url: String(project.url || ''),
          technologies: Array.isArray(project.technologies) 
            ? project.technologies
                .filter((t: any) => t && typeof t !== 'object' && !t.$$typeof && !t._owner && !t._store)
                .map((t: any) => String(t || ''))
            : [],
        })),
      theme: {
        template: String(sanitizedData?.theme?.template || 'modern') as 'minimalist' | 'modern' | 'creative',
        primaryColor: String(sanitizedData?.theme?.primaryColor || '#3b82f6'),
        darkMode: Boolean(sanitizedData?.theme?.darkMode),
      },
    };
    
    // Use renderToBuffer instead of pdf() - Next.js 15 compatible
    // Use React.createElement to avoid JSX transform issues that can cause React Error #31
    // Ensure finalData is completely clean (no React elements)
    const cleanData = JSON.parse(JSON.stringify(finalData)) as ResumeData;
    const pdfElement = React.createElement(ResumePDF, { data: cleanData });
    
    // renderToBuffer returns a Promise<Buffer> directly
    const buffer = await renderToBuffer(pdfElement as any);
    
    // Generate filename from sanitized data
    const firstName = finalData.personalInfo.firstName || 'Resume';
    const lastName = finalData.personalInfo.lastName || '';
    const namePart = lastName ? `${firstName}_${lastName}` : firstName;
    const date = new Date().toISOString().split('T')[0];
    const filename = `${namePart}_CV_${date}.pdf`;
    
    // Convert Buffer to Uint8Array for NextResponse compatibility
    const uint8Array = new Uint8Array(buffer);
    
    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: unknown) {
    console.error('PDF generation failed:', error);
    
    // Safely extract error message
    let errorMessage = 'PDF generation failed - please check your data';
    
    if (error instanceof Error) {
      errorMessage = String(error.message || errorMessage);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
