'use client';

import { ResumeData } from '@/lib/types';
import { Button } from './ui/button';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { PdfExporter } from './PdfExporter';
import { WordExporter } from './export/WordExporter';
import { useState, useEffect } from 'react';

interface ExportButtonsProps {
  data: ResumeData;
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Check if personal info is filled
  const hasPersonalInfo = Boolean(data?.personalInfo?.firstName);

  if (!mounted) {
    return (
      <div className="space-y-3">
        <Button disabled className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Loading...
        </Button>
        <Button disabled className="w-full" variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Loading...
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Success Toast */}
      {successMessage && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-200 transition-opacity duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* PDF Export Button (Primary) */}
      <div className="relative">
        <PdfExporter 
          data={data}
          onSuccess={(filename) => {
            setSuccessMessage(`CV exported! 🎉 (${filename})`);
          }}
        />
      </div>

      {/* Word Export Button (Secondary) */}
      <div className="relative">
        <WordExporter 
          data={data}
          onSuccess={(filename) => {
            setSuccessMessage(`CV exported! 🎉 (${filename})`);
          }}
        />
      </div>

      {/* Helper text */}
      {!hasPersonalInfo && (
        <p className="text-xs text-muted-foreground text-center">
          Add your personal information to enable exports
        </p>
      )}
    </div>
  );
}
