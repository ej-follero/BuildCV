export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  theme: {
    template: 'minimalist' | 'modern' | 'creative' | 'professional' | 'executive';
    primaryColor: string;
    darkMode: boolean;
  };
}

export type Step = 'personal' | 'experience' | 'education' | 'skills' | 'summary';

export interface ResumeScore {
  overall: number;
  grammar: number;
  keywords: number;
  formatting: number;
  suggestions: string[];
}

export interface AISuggestion {
  type: 'bullet' | 'summary' | 'keyword';
  original?: string;
  suggestion: string;
  reason: string;
}
