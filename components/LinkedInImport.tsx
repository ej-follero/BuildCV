'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Linkedin, Upload } from 'lucide-react';
import { ResumeData } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface LinkedInImportProps {
  onImport: (data: Partial<ResumeData>) => void;
}

export function LinkedInImport({ onImport }: LinkedInImportProps) {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!linkedInUrl.trim()) return;
    
    setIsImporting(true);
    try {
      // Simulate LinkedIn import - in production, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Parse LinkedIn URL (placeholder logic)
      const profileMatch = linkedInUrl.match(/linkedin\.com\/in\/([^/]+)/);
      
      if (profileMatch) {
        // Mock data extraction - replace with actual LinkedIn API integration
        const mockData: Partial<ResumeData> = {
          personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            linkedin: linkedInUrl,
            summary: 'Experienced professional with a track record of success.',
          },
          experiences: [
            {
              id: generateId(),
              company: 'Tech Company',
              position: 'Senior Developer',
              location: 'San Francisco, CA',
              startDate: '2020-01-01',
              endDate: '',
              current: true,
              description: 'Led development teams and delivered high-quality software solutions.',
            },
          ],
        };
        
        onImport(mockData);
        alert('LinkedIn profile imported successfully! Please review and update the information.');
      } else {
        alert('Invalid LinkedIn URL. Please use format: https://linkedin.com/in/username');
      }
    } catch (error) {
      console.error('Failed to import LinkedIn profile:', error);
      alert('Failed to import LinkedIn profile. Please try again or enter manually.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Linkedin className="w-5 h-5" />
          Import from LinkedIn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
          <Textarea
            id="linkedin-url"
            value={linkedInUrl}
            onChange={(e) => setLinkedInUrl(e.target.value)}
            placeholder="https://linkedin.com/in/your-profile"
            className="mt-1 min-h-[80px]"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Paste your LinkedIn profile URL to auto-populate resume data
          </p>
        </div>
        <Button
          onClick={handleImport}
          disabled={!linkedInUrl.trim() || isImporting}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isImporting ? 'Importing...' : 'Import Profile'}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Note: This is a demo feature. In production, this would require LinkedIn API integration.
        </p>
      </CardContent>
    </Card>
  );
}
