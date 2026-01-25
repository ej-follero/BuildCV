'use client';

import { useState } from 'react';
import { ResumeData, ResumeScore, AISuggestion } from '@/lib/types';
import { analyzeResume, tailorToJobDescription, generateContentSuggestion } from '@/lib/ai/resumeAI';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIFeaturesProps {
  resumeData: ResumeData;
  onSuggestionApply?: (suggestion: AISuggestion) => void;
}

export function AIFeatures({ resumeData, onSuggestionApply }: AIFeaturesProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [score, setScore] = useState<ResumeScore | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  
  // Content Suggestions state
  const [contentContext, setContentContext] = useState('');
  const [contentType, setContentType] = useState<'bullet' | 'summary'>('bullet');
  const [jobTitle, setJobTitle] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(resumeData);
      setScore(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTailor = async () => {
    if (!jobDescription.trim()) return;
    setIsTailoring(true);
    try {
      const result = await tailorToJobDescription(resumeData, jobDescription);
      setSuggestions(result);
    } finally {
      setIsTailoring(false);
    }
  };

  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 90) return 'text-green-500';
    if (scoreValue >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Resume Scoring */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>
            Resume Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {score ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className={`text-5xl font-bold ${getScoreColor(score.overall)}`}>
                  {score.overall}
                </div>
                <div className="text-sm text-muted-foreground mt-2">Overall Score</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">Grammar</div>
                  <div className={getScoreColor(score.grammar)}>{score.grammar}</div>
                </div>
                <div>
                  <div className="font-medium">Keywords</div>
                  <div className={getScoreColor(score.keywords)}>{score.keywords}</div>
                </div>
                <div>
                  <div className="font-medium">Formatting</div>
                  <div className={getScoreColor(score.formatting)}>{score.formatting}</div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Suggestions:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {score.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Job Description Tailoring */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>
            Tailor to Job Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="jd">Paste Job Description</Label>
            <Textarea
              id="jd"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="mt-1 min-h-[120px]"
            />
          </div>
          <Button onClick={handleTailor} disabled={!jobDescription.trim() || isTailoring} className="w-full">
            <Target className="w-4 h-4 mr-2" />
            {isTailoring ? 'Analyzing...' : 'Get Tailoring Suggestions'}
          </Button>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="font-medium">Suggestions:</div>
                {suggestions.map((suggestion, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-secondary rounded-lg text-sm"
                  >
                    <div className="font-medium mb-1">{suggestion.reason}</div>
                    {suggestion.original && (
                      <div className="text-muted-foreground mb-2">
                        Original: {suggestion.original}
                      </div>
                    )}
                    <div className="mb-2">{suggestion.suggestion}</div>
                    {onSuggestionApply && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onSuggestionApply(suggestion);
                          // Remove the applied suggestion from the list
                          setSuggestions((prev) => prev.filter((_, i) => i !== idx));
                        }}
                      >
                        Apply Suggestion
                      </Button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Content Suggestions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>
            Content Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate AI-powered bullet points or summaries based on your experience.
          </p>
          
          {/* Type Selection */}
          <div className="flex gap-2">
            <Button
              variant={contentType === 'bullet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setContentType('bullet');
                setGeneratedContent(null);
              }}
              className="flex-1"
            >
              Bullet Point
            </Button>
            <Button
              variant={contentType === 'summary' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setContentType('summary');
                setGeneratedContent(null);
              }}
              className="flex-1"
            >
              Summary
            </Button>
          </div>

          {/* Context Input */}
          <div>
            <Label htmlFor="content-context">
              {contentType === 'bullet' ? 'What did you accomplish?' : 'Describe your background'}
            </Label>
            <Textarea
              id="content-context"
              value={contentContext}
              onChange={(e) => setContentContext(e.target.value)}
              placeholder={
                contentType === 'bullet'
                  ? 'e.g., Led a team of 5 developers to deliver a new feature'
                  : 'e.g., 5 years of experience in software development with expertise in React and Node.js'
              }
              className="mt-1 min-h-[100px]"
            />
          </div>

          {/* Job Title (for summary only) */}
          {contentType === 'summary' && (
            <div>
              <Label htmlFor="job-title">Job Title (optional)</Label>
              <Textarea
                id="job-title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="mt-1 min-h-[60px]"
              />
            </div>
          )}

          {/* Generate Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              if (!contentContext.trim()) {
                alert('Please enter some context first.');
                return;
              }
              
              setIsGenerating(true);
              setGeneratedContent(null);
              try {
                const suggestion = await generateContentSuggestion(
                  contentType,
                  contentContext,
                  contentType === 'summary' ? jobTitle || undefined : undefined
                );
                setGeneratedContent(suggestion);
              } catch (error) {
                console.error('Failed to generate content:', error);
                alert('Failed to generate suggestion. Please try again.');
              } finally {
                setIsGenerating(false);
              }
            }}
            disabled={!contentContext.trim() || isGenerating}
          >
            {isGenerating ? 'Generating...' : `Generate ${contentType === 'bullet' ? 'Bullet Point' : 'Summary'}`}
          </Button>

          {/* Generated Content Display */}
          <AnimatePresence>
            {generatedContent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-secondary rounded-lg space-y-3"
              >
                <div className="font-medium">Generated {contentType === 'bullet' ? 'Bullet Point' : 'Summary'}:</div>
                <div className="text-sm whitespace-pre-wrap">{generatedContent}</div>
                {onSuggestionApply && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Create a suggestion object to apply
                        const suggestion: AISuggestion = {
                          type: contentType === 'bullet' ? 'bullet' : 'summary',
                          suggestion: generatedContent,
                          reason: `AI-generated ${contentType}`,
                          original: contentContext,
                        };
                        onSuggestionApply(suggestion);
                        setGeneratedContent(null);
                        setContentContext('');
                        if (contentType === 'summary') {
                          setJobTitle('');
                        }
                      }}
                    >
                      Apply to Resume
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setGeneratedContent(null);
                      }}
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
