import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean(),
  gpa: z.string().optional(),
  description: z.string().optional(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
});

export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema,
  experiences: z.array(experienceSchema).min(1, 'At least one experience is required'),
  education: z.array(educationSchema).min(1, 'At least one education entry is required'),
  skills: z.array(skillSchema).min(1, 'At least one skill is required'),
  projects: z.array(projectSchema).optional().default([]),
  theme: z.object({
    template: z.enum(['minimalist', 'modern', 'creative', 'professional', 'executive']),
    primaryColor: z.string(),
    darkMode: z.boolean(),
  }),
});
