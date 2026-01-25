'use client';

import { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, BlobProvider } from '@react-pdf/renderer';
import { cn } from '@/lib/utils';
import React, { useMemo, useState, useEffect } from 'react';

interface PdfExporterProps {
  data: ResumeData;
}

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

function ResumePDF({ data }: { data: ResumeData }) {
  // Defensive checks - ensure data exists and has required properties
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
  
  // Ensure all arrays exist and are arrays
  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  const safeEducation = Array.isArray(education) ? education : [];
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  // Ensure personalInfo exists and has all required string properties
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {safePersonalInfo.firstName} {safePersonalInfo.lastName}
          </Text>
          {safePersonalInfo.email && <Text style={styles.contact}>{safePersonalInfo.email}</Text>}
          {safePersonalInfo.phone && <Text style={styles.contact}>{safePersonalInfo.phone}</Text>}
          {safePersonalInfo.location && <Text style={styles.contact}>{safePersonalInfo.location}</Text>}
        </View>

        {/* Summary */}
        {safePersonalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.description}>{safePersonalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {safeExperiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {safeExperiences.map((exp) => (
              <View key={exp.id || Math.random()} style={{ marginBottom: 10 }}>
                <Text style={styles.jobTitle}>{String(exp.position || '')}</Text>
                <Text style={styles.company}>
                  {String(exp.company || '')} • {String(exp.location || '')}
                </Text>
                <Text style={styles.date}>
                  {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} -{' '}
                  {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : '')}
                </Text>
                <Text style={styles.description}>{String(exp.description || '')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {safeEducation.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {safeEducation.map((edu) => (
              <View key={edu.id || Math.random()} style={{ marginBottom: 8 }}>
                <Text style={styles.jobTitle}>
                  {String(edu.degree || '')} in {String(edu.field || '')}
                </Text>
                <Text style={styles.company}>
                  {String(edu.institution || '')} • {String(edu.location || '')}
                </Text>
                <Text style={styles.date}>
                  {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : ''} -{' '}
                  {edu.current ? 'Present' : (edu.endDate ? new Date(edu.endDate).toLocaleDateString() : '')}
                  {edu.gpa ? ` • GPA: ${String(edu.gpa)}` : ''}
                </Text>
                {edu.description && <Text style={styles.description}>{String(edu.description)}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {safeSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {safeSkills.map((skill) => (
              <Text key={skill.id || Math.random()} style={styles.skillItem}>
                {String(skill.name || '')} ({String(skill.level || '')})
              </Text>
            ))}
          </View>
        )}

        {/* Projects */}
        {safeProjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {safeProjects.map((project) => (
              <View key={project.id || Math.random()} style={{ marginBottom: 8 }}>
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

export function PdfExporter({ data }: PdfExporterProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create a fully sanitized data object to ensure all properties exist
  // This prevents React PDF from encountering undefined values
  // Always call useMemo hooks before any conditional returns to follow Rules of Hooks
  const sanitizedData: ResumeData = useMemo(() => ({
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
  }), [data]);

  // Determine if data is valid - use this to control document creation
  const isValidData = Boolean(data && data.personalInfo && typeof data.personalInfo === 'object');
  
  // Helper function to deeply validate sanitizedData
  const isSanitizedDataValid = useMemo(() => {
    if (!sanitizedData || typeof sanitizedData !== 'object') return false;
    if (!sanitizedData.personalInfo || typeof sanitizedData.personalInfo !== 'object') return false;
    // Ensure all required personalInfo fields are strings (not undefined)
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'location', 'summary'];
    for (const field of requiredFields) {
      if (typeof sanitizedData.personalInfo[field as keyof typeof sanitizedData.personalInfo] !== 'string') {
        return false;
      }
    }
    // Ensure arrays exist and are arrays
    if (!Array.isArray(sanitizedData.experiences)) return false;
    if (!Array.isArray(sanitizedData.education)) return false;
    if (!Array.isArray(sanitizedData.skills)) return false;
    if (!Array.isArray(sanitizedData.projects)) return false;
    return true;
  }, [sanitizedData]);
  
  // Memoize the document to prevent unnecessary re-renders
  // Always call this hook before any conditional returns
  // Only create document when mounted, data is valid, and sanitized data passes deep validation
  const pdfDocument = useMemo(() => {
    // Don't create document if not mounted (SSR safety)
    if (!mounted) {
      return null;
    }
    // Don't create document if data is invalid
    if (!isValidData) {
      return null;
    }
    // Ensure sanitizedData passes deep validation before creating document
    if (!isSanitizedDataValid) {
      return null;
    }
    // Create document - all conditions are met at this point
    // Ensure we always return a valid React element
    try {
      return <ResumePDF data={sanitizedData} />;
    } catch (error) {
      console.error('Error creating PDF document:', error);
      return null;
    }
  }, [sanitizedData, isValidData, isSanitizedDataValid, mounted]);

  // Validate data after all hooks are called
  if (!isValidData) {
    return (
      <Button disabled className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Invalid Data
      </Button>
    );
  }

  const firstName = data.personalInfo?.firstName || 'Resume';
  const lastName = data.personalInfo?.lastName || '';
  const fileName = `${firstName}${lastName ? '_' + lastName : ''}_Resume.pdf`;

  // Only render BlobProvider when we have valid data, are mounted, and document is valid
  // This ensures pdfDocument is always valid when passed to BlobProvider
  // Use React.isValidElement to ensure pdfDocument is a valid React element
  if (!mounted || !isValidData || !isSanitizedDataValid || !pdfDocument || !React.isValidElement(pdfDocument)) {
    return (
      <Button disabled className="w-full">
        <Download className="w-4 h-4 mr-2" />
        {!mounted ? 'Loading...' : !isValidData || !isSanitizedDataValid ? 'Preparing PDF...' : !pdfDocument ? 'Preparing PDF...' : 'Invalid Data'}
      </Button>
    );
  }

  try {
    return (
      <BlobProvider document={pdfDocument}>
        {({ blob, url, loading, error }) => {
          const handleDownload = () => {
            if (!blob || !url) return;
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };

          const isDisabled = loading || !!error || !blob;

          return (
            <Button
              onClick={handleDownload}
              disabled={isDisabled}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Generating PDF...' : error ? 'Error generating PDF' : 'Export as PDF'}
            </Button>
          );
        }}
      </BlobProvider>
    );
  } catch (err) {
    // Fallback if BlobProvider fails
    console.error('Error rendering PDF:', err);
    return (
      <Button disabled className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Error: Unable to generate PDF
      </Button>
    );
  }
}
