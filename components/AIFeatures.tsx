'use client';

import { useState } from 'react';
import { ResumeData, ResumeScore, AISuggestion } from '@/lib/types';
import { analyzeResume, tailorToJobDescription, generateContentSuggestion } from '@/lib/ai/resumeAI';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Target, Lightbulb, TrendingUp } from 'lucide-react';
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
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
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
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
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
                        onClick={() => onSuggestionApply(suggestion)}
                      >
                        Apply
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
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Content Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Get AI-powered suggestions for improving your resume content.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              const suggestion = await generateContentSuggestion(
                'bullet',
                'Led cross-functional team',
                'Software Engineer'
              );
              alert(`Suggestion: ${suggestion}`);
            }}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Generate Bullet Point
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
