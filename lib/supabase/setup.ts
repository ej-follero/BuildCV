// Supabase integration setup
// To use Supabase, install: npm install @supabase/supabase-js
// Then add your Supabase URL and anon key to .env.local:
// NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

import { ResumeData } from '../types';

// Uncomment and configure when Supabase is set up
/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveResumeToCloud(userId: string, data: ResumeData): Promise<void> {
  const { error } = await supabase
    .from('resumes')
    .upsert({
      user_id: userId,
      data: data,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Failed to save to cloud:', error);
    throw error;
  }
}

export async function loadResumeFromCloud(userId: string): Promise<ResumeData | null> {
  const { data, error } = await supabase
    .from('resumes')
    .select('data')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Failed to load from cloud:', error);
    return null;
  }

  return data?.data as ResumeData;
}

export async function createShareableLink(data: ResumeData): Promise<string> {
  const { data: shareData, error } = await supabase
    .from('shared_resumes')
    .insert({
      data: data,
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    console.error('Failed to create shareable link:', error);
    throw error;
  }

  return `${window.location.origin}/resume/${shareData.id}`;
}

export async function loadSharedResume(shareId: string): Promise<ResumeData | null> {
  const { data, error } = await supabase
    .from('shared_resumes')
    .select('data')
    .eq('id', shareId)
    .single();

  if (error) {
    console.error('Failed to load shared resume:', error);
    return null;
  }

  return data?.data as ResumeData;
}
*/

// Placeholder functions for when Supabase is not configured
export async function saveResumeToCloud(userId: string, data: ResumeData): Promise<void> {
  console.warn('Supabase not configured. Install @supabase/supabase-js and configure environment variables.');
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(`resume-${userId}`, JSON.stringify(data));
  }
}

export async function loadResumeFromCloud(userId: string): Promise<ResumeData | null> {
  console.warn('Supabase not configured. Install @supabase/supabase-js and configure environment variables.');
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`resume-${userId}`);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

export async function createShareableLink(data: ResumeData): Promise<string> {
  console.warn('Supabase not configured. Using URL encoding fallback.');
  // Fallback: encode data in URL
  const encoded = btoa(JSON.stringify(data));
  return `${window.location.origin}/?share=${encoded}`;
}

export async function loadSharedResume(shareId: string): Promise<ResumeData | null> {
  console.warn('Supabase not configured.');
  // Fallback: decode from URL
  try {
    const decoded = atob(shareId);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// SQL schema for Supabase (run this in Supabase SQL editor):
/*
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE shared_resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_shared_resumes_id ON shared_resumes(id);
*/
