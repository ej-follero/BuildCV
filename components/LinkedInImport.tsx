'use client';

import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload, FileText } from 'lucide-react';
import { ResumeData } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface LinkedInImportProps {
  onImport: (data: Partial<ResumeData>) => void;
}

export function LinkedInImport({ onImport }: LinkedInImportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file. Resume PDFs are supported from any source.');
      return;
    }

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/resume-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse PDF');
      }

      const pdfData = result.data;

      // Map PDF data to ResumeData format
      const nameParts = pdfData.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const importedData: Partial<ResumeData> = {
        personalInfo: {
          firstName,
          lastName,
          email: '', // Not available from PDF
          phone: '', // Not available from PDF
          location: pdfData.location || '',
          linkedin: '',
          summary: pdfData.summary || pdfData.headline || '',
        },
      };

      // Map experiences
      if (pdfData.experiences && pdfData.experiences.length > 0) {
        importedData.experiences = pdfData.experiences.map((exp: any) => ({
          id: generateId(),
          company: exp.company || 'Unknown Company',
          position: exp.title || '',
          location: '',
          startDate: '',
          endDate: '',
          current: !exp.duration || exp.duration.includes('Present') || exp.duration.includes('Current'),
          description: exp.description || '',
        }));
      }

      // Map education
      if (pdfData.education && pdfData.education.length > 0) {
        importedData.education = pdfData.education.map((edu: any) => ({
          id: generateId(),
          school: edu.school || '',
          degree: edu.degree || '',
          field: edu.field || '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
        }));
      }

      // Map skills
      if (pdfData.skills && pdfData.skills.length > 0) {
        importedData.skills = pdfData.skills.map((skill: string) => ({
          id: generateId(),
          name: skill,
          level: 'intermediate' as const,
        }));
      }

      onImport(importedData);
      
      const importedFields = [
        pdfData.name && 'Name',
        pdfData.headline && 'Headline',
        pdfData.location && 'Location',
        pdfData.experiences?.length && `${pdfData.experiences.length} Experience(s)`,
        pdfData.education?.length && `${pdfData.education.length} Education(s)`,
        pdfData.skills?.length && `${pdfData.skills.length} Skill(s)`,
      ].filter(Boolean).join(', ');

      alert(`Resume imported successfully! 🎉\n\nImported: ${importedFields}\n\nPlease review and update the information as needed.`);
    } catch (error: any) {
      console.error('Failed to import PDF:', error);
      const errorMessage = error.message || 'Failed to parse PDF.';
      alert(`${errorMessage}\n\nMake sure the PDF is not scanned or password-protected. Text-based PDF resumes work best.`);
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Import Resume from PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pdf-upload" className="text-sm font-medium">
            Upload Resume PDF
          </Label>
          <div className="flex flex-col gap-3">
            <input
              ref={fileInputRef}
              type="file"
              id="pdf-upload"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isImporting}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="w-full"
              variant="default"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? 'Parsing PDF...' : 'Upload Resume PDF'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Upload any resume PDF (LinkedIn export, Word export, or any other resume PDF)
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            📄 Supported PDF Sources:
          </p>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
            <li><strong>LinkedIn PDF:</strong> Settings → Data privacy → Get a copy of your data → Resume</li>
            <li><strong>Old Resumes:</strong> Any PDF resume you've saved before</li>
            <li><strong>Word/Google Docs:</strong> Export as PDF first, then upload</li>
            <li><strong>Other Sources:</strong> Any text-based PDF resume works!</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
