'use client';

import { ResumeData } from '@/lib/types';
import { Button } from './ui/button';
import { Download, FileText } from 'lucide-react';
import { PdfExporter } from './PdfExporter';
import { exportToWord } from '@/lib/export/wordExport';

interface ExportButtonsProps {
  data: ResumeData;
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const handleWordExport = () => {
    try {
      exportToWord(data);
    } catch (error) {
      console.error('Failed to export Word document:', error);
      alert('Failed to export Word document. Please try again.');
    }
  };

  return (
    <div className="space-y-3">
      <PdfExporter data={data} />
      <Button
        onClick={handleWordExport}
        variant="outline"
        className="w-full"
      >
        <FileText className="w-4 h-4 mr-2" />
        Export as Word
      </Button>
    </div>
  );
}
