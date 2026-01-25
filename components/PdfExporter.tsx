'use client';

import { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

// Deep sanitize helper - removes React elements and ensures JSON serializability
function deepSanitize(value: any): any {
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
    return value.map(item => deepSanitize(item)).filter(item => item !== null && item !== undefined);
  }
  
  // Handle plain objects
  const sanitized: any = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      // Skip React internal properties
      if (key.startsWith('_') || key.startsWith('$')) {
        continue;
      }
      const sanitizedValue = deepSanitize(value[key]);
      if (sanitizedValue !== null && sanitizedValue !== undefined) {
        sanitized[key] = sanitizedValue;
      }
    }
  }
  return sanitized;
}

// Sanitize data helper - ensures all values are strings/primitives
// PDF generation is handled server-side via API route to avoid Next.js 15 + react-pdf incompatibility
function sanitizeData(data: ResumeData): ResumeData {
  // First deep sanitize to remove any React elements
  const cleaned = deepSanitize(data);
  
  return {
    personalInfo: {
      firstName: String(cleaned?.personalInfo?.firstName || data?.personalInfo?.firstName || ''),
      lastName: String(cleaned?.personalInfo?.lastName || data?.personalInfo?.lastName || ''),
      email: String(cleaned?.personalInfo?.email || data?.personalInfo?.email || ''),
      phone: String(cleaned?.personalInfo?.phone || data?.personalInfo?.phone || ''),
      location: String(cleaned?.personalInfo?.location || data?.personalInfo?.location || ''),
      website: String(cleaned?.personalInfo?.website || data?.personalInfo?.website || ''),
      linkedin: String(cleaned?.personalInfo?.linkedin || data?.personalInfo?.linkedin || ''),
      github: String(cleaned?.personalInfo?.github || data?.personalInfo?.github || ''),
      summary: String(cleaned?.personalInfo?.summary || data?.personalInfo?.summary || ''),
    },
    experiences: (cleaned?.experiences || data?.experiences || []).filter((exp: any) => exp && typeof exp === 'object' && exp.id).map((exp: any) => ({
      id: String(exp.id || ''),
      company: String(exp.company || ''),
      position: String(exp.position || ''),
      location: String(exp.location || ''),
      startDate: String(exp.startDate || ''),
      endDate: String(exp.endDate || ''),
      current: Boolean(exp.current),
      description: String(exp.description || ''),
    })),
    education: (cleaned?.education || data?.education || []).filter((edu: any) => edu && typeof edu === 'object' && edu.id).map((edu: any) => ({
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
    skills: (cleaned?.skills || data?.skills || []).filter((skill: any) => skill && typeof skill === 'object' && skill.id).map((skill: any) => ({
      id: String(skill.id || ''),
      name: String(skill.name || ''),
      level: (skill.level || 'intermediate') as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    })),
    projects: (cleaned?.projects || data?.projects || []).filter((project: any) => project && typeof project === 'object' && project.id).map((project: any) => ({
      id: String(project.id || ''),
      name: String(project.name || ''),
      description: String(project.description || ''),
      url: String(project.url || ''),
      technologies: Array.isArray(project.technologies) ? project.technologies.filter(Boolean).map((t: any) => String(t || '')) : [],
    })),
    theme: {
      template: (cleaned?.theme?.template || data?.theme?.template || 'modern') as 'minimalist' | 'modern' | 'creative',
      primaryColor: String(cleaned?.theme?.primaryColor || data?.theme?.primaryColor || '#3b82f6'),
      darkMode: Boolean(cleaned?.theme?.darkMode ?? data?.theme?.darkMode),
    },
  };
}

export function PdfExporter({ 
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
  
  // Generate filename: First_Last_CV_YYYY-MM-DD.pdf
  const generateFileName = (): string => {
    const firstName = sanitizedData.personalInfo.firstName || 'Resume';
    const lastName = sanitizedData.personalInfo.lastName || '';
    const namePart = lastName ? `${firstName}_${lastName}` : firstName;
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `${namePart}_CV_${date}.pdf`;
  };
  
  const fileName = generateFileName();

  // Early return if no personal info
  if (!data?.personalInfo?.firstName) {
    return (
      <Button disabled className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Add personal info first
      </Button>
    );
  }

  // Handle PDF generation via API route to avoid React internals access issues
  const handleDownload = async () => {
    if (!isMounted || isGenerating) return;

    setIsGenerating(true);
    
    try {
      // Ensure data is fully serializable before sending
      const serializableData = JSON.parse(JSON.stringify(sanitizedData));
      
      // Generate PDF server-side via API route to avoid Next.js 15 + react-pdf incompatibility
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serializableData),
      });

      // Handle error response without throwing React elements
      if (!response.ok) {
        let errorMessage = `Failed to generate PDF (${response.status})`;
        try {
          const errorData = await response.json();
          // Ensure error message is always a plain string
          const errorText = String(errorData?.error || '');
          const detailsText = String(errorData?.details || '');
          if (errorText) {
            errorMessage = errorText;
          }
          if (detailsText && detailsText !== errorText) {
            errorMessage = `${errorMessage}: ${detailsText}`;
          }
        } catch (e) {
          // Fallback to status text if JSON parsing fails
          const statusText = String(response.statusText || '');
          if (statusText) {
            errorMessage = `${errorMessage}: ${statusText}`;
          }
        }
        // Show error without throwing (prevents React Error #31)
        alert(errorMessage);
        setIsGenerating(false);
        return;
      }

      // Get PDF blob from response
      const blob = await response.blob();
      
      // Verify blob is valid
      if (!blob || blob.size === 0) {
        alert('Failed to generate PDF: Empty response');
        setIsGenerating(false);
        return;
      }
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(fileName);
      }
    } catch (error: unknown) {
      // Safe error handling - ensure message is always a string
      console.error('Error generating PDF:', error);
      let errorMessage = 'Failed to generate PDF. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = String(error.message || errorMessage);
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        // For any other error type, convert to string safely
        try {
          errorMessage = String(error);
        } catch {
          errorMessage = 'Failed to generate PDF. Please try again.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isMounted) {
    return (
      <Button disabled className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Loading PDF...
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isGenerating} 
      className="w-full"
    >
      <Download className="w-4 h-4 mr-2" />
      {isGenerating ? 'Generating...' : 'Download PDF'}
    </Button>
  );
}
