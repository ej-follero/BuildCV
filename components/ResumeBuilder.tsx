'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResumeData, Step } from '@/lib/types';
import { resumeDataSchema } from '@/lib/validation';
import { getInitialResumeData, exportResumeData, importResumeData } from '@/lib/storage';
import { getExampleResumeData, getDefaultResumeData } from '@/lib/utils';
import { Stepper } from './Stepper';
import { TemplatePreview } from './TemplatePreview';
import { ExportButtons } from './ExportButtons';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { AIFeatures } from './AIFeatures';
import { LinkedInImport } from './LinkedInImport';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Select } from './ui/select';
import { ColorPicker } from './ColorPicker';
import { useTheme } from './ThemeProvider';
import { useHistory } from '@/lib/hooks/useHistory';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { ChevronLeft, ChevronRight, Moon, Sun, Download, Upload, FileText, Undo2, Redo2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveResumeData } from '@/lib/storage';

const steps: { key: Step; label: string }[] = [
  { key: 'personal', label: 'Personal' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'summary', label: 'Preview' },
];

export function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [mounted, setMounted] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    // Use default data during SSR, will be updated on mount
    if (typeof window === 'undefined') {
      return getDefaultResumeData();
    }
    return getInitialResumeData();
  });
  const { theme, toggleTheme } = useTheme();

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeDataSchema),
    defaultValues: resumeData,
    mode: 'onChange',
  });

  const { handleSubmit, watch, setValue } = form;
  const watchedData = watch();

  // History management
  const history = useHistory(resumeData);

  // Mark as mounted and load data from localStorage
  useEffect(() => {
    setMounted(true);
    const loadedData = getInitialResumeData();
    setResumeData(loadedData);
    // Reset form with loaded data
    Object.keys(loadedData).forEach((key) => {
      setValue(key as keyof ResumeData, loadedData[key as keyof ResumeData] as any);
    });
  }, [setValue]);

  // Auto-save to localStorage and history
  useEffect(() => {
    const subscription = watch((data) => {
      const formData = data as ResumeData;
      setResumeData(formData);
      saveResumeData(formData);
      // Add to history (debounced)
      const timeoutId = setTimeout(() => {
        history.addToHistory(formData);
      }, 1000);
      return () => clearTimeout(timeoutId);
    });
    return () => subscription.unsubscribe();
  }, [watch, history]);

  const stepIndex = steps.findIndex((s) => s.key === currentStep);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const handleNext = async () => {
    let fieldsToValidate: (keyof ResumeData)[] = [];
    
    switch (currentStep) {
      case 'personal':
        fieldsToValidate = ['personalInfo'];
        break;
      case 'experience':
        fieldsToValidate = ['experiences'];
        break;
      case 'education':
        fieldsToValidate = ['education'];
        break;
      case 'skills':
        fieldsToValidate = ['skills', 'projects'];
        break;
      default:
        fieldsToValidate = [];
    }

    const isValid = fieldsToValidate.length === 0 || await form.trigger(fieldsToValidate as any);
    if (isValid) {
      const currentIndex = steps.findIndex((s) => s.key === currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1].key);
      }
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex((s) => s.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key);
    }
  };

  const handleExportPDF = () => {
    // This will be handled by ExportButtons component
    if (currentStep === 'summary') {
      const button = document.querySelector('button:has(svg[class*="Download"])') as HTMLButtonElement;
      button?.click();
    }
  };

  const handleStepClick = (step: Step) => {
    const stepIdx = steps.findIndex((s) => s.key === step);
    const currentIdx = steps.findIndex((s) => s.key === currentStep);
    if (stepIdx <= currentIdx) {
      setCurrentStep(step);
    }
  };

  const handleLoadExample = () => {
    const example = getExampleResumeData();
    Object.keys(example).forEach((key) => {
      setValue(key as keyof ResumeData, example[key as keyof ResumeData] as any);
    });
    setResumeData(example);
    history.addToHistory(example);
  };

  const handleLinkedInImport = (importedData: Partial<ResumeData>) => {
    const mergedData = { ...resumeData, ...importedData };
    Object.keys(mergedData).forEach((key) => {
      setValue(key as keyof ResumeData, mergedData[key as keyof ResumeData] as any);
    });
    setResumeData(mergedData as ResumeData);
    history.addToHistory(mergedData as ResumeData);
  };

  const handleExportJSON = () => {
    const json = exportResumeData(resumeData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          const imported = importResumeData(json);
          if (imported) {
            Object.keys(imported).forEach((key) => {
              setValue(key as keyof ResumeData, imported[key as keyof ResumeData] as any);
            });
            setResumeData(imported);
          } else {
            alert('Failed to import resume data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoSection form={form as any} />;
      case 'experience':
        return <ExperienceSection form={form as any} />;
      case 'education':
        return <EducationSection form={form as any} />;
      case 'skills':
        return <SkillsSection form={form as any} />;
      case 'summary':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview & Export</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportJSON}>
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
                <Button variant="outline" size="sm" onClick={handleImportJSON}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import JSON
                </Button>
              </div>
            </div>
            <ExportButtons data={resumeData} />
            <LinkedInImport onImport={handleLinkedInImport} />
            <AIFeatures resumeData={resumeData} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...form}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <header className="glass-card border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">Resume Builder</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const previous = history.undo();
                    if (previous) {
                      Object.keys(previous).forEach((key) => {
                        setValue(key as keyof ResumeData, previous[key as keyof ResumeData] as any);
                      });
                      setResumeData(previous);
                    }
                  }}
                  disabled={!history.canUndo}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const next = history.redo();
                    if (next) {
                      Object.keys(next).forEach((key) => {
                        setValue(key as keyof ResumeData, next[key as keyof ResumeData] as any);
                      });
                      setResumeData(next);
                    }
                  }}
                  disabled={!history.canRedo}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLoadExample}>
                  Load Example
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {stepIndex + 1} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <Stepper currentStep={currentStep} steps={steps} onStepClick={handleStepClick} />
          </div>

          {/* Main Content - Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6 order-2 lg:order-1">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <span>{steps[stepIndex].label}</span>
                    {currentStep === 'summary' && (
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Select
                          value={resumeData.theme.template}
                          onChange={(e) => {
                            const template = e.target.value as 'minimalist' | 'modern' | 'creative' | 'professional' | 'executive';
                            setValue('theme.template', template);
                            setResumeData((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, template },
                            }));
                          }}
                          className="w-full sm:w-40"
                        >
                          <option value="minimalist">Minimalist</option>
                          <option value="modern">Modern</option>
                          <option value="creative">Creative</option>
                          <option value="professional">Professional</option>
                          <option value="executive">Executive</option>
                        </Select>
                        <ColorPicker
                          color={resumeData.theme.primaryColor}
                          onChange={(color) => {
                            setValue('theme.primaryColor', color);
                            setResumeData((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, primaryColor: color },
                            }));
                          }}
                        />
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderStepContent()}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  {currentStep !== 'summary' && (
                    <div className="flex justify-between mt-8 pt-6 border-t gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={stepIndex === 0}
                        className="flex-1 sm:flex-initial"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button type="button" onClick={handleNext} className="flex-1 sm:flex-initial">
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:sticky lg:top-24 h-fit order-1 lg:order-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-lg max-h-[800px] lg:max-h-none overflow-y-auto">
                    {mounted ? (
                      <TemplatePreview data={resumeData} className="min-h-[600px] lg:min-h-[800px]" />
                    ) : (
                      <div className="min-h-[600px] lg:min-h-[800px] flex items-center justify-center">
                        <div className="text-muted-foreground">Loading preview...</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
