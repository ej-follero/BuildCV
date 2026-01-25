import { ResumeData } from './types';
import { getDefaultResumeData } from './utils';

const STORAGE_KEY = 'resume-builder-data';

export function saveResumeData(data: ResumeData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save resume data:', error);
  }
}

export function loadResumeData(): ResumeData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ResumeData;
  } catch (error) {
    console.error('Failed to load resume data:', error);
    return null;
  }
}

export function clearResumeData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear resume data:', error);
  }
}

export function exportResumeData(data: ResumeData): string {
  return JSON.stringify(data, null, 2);
}

export function importResumeData(jsonString: string): ResumeData | null {
  try {
    const data = JSON.parse(jsonString);
    return data as ResumeData;
  } catch (error) {
    console.error('Failed to import resume data:', error);
    return null;
  }
}

export function getInitialResumeData(): ResumeData {
  const stored = loadResumeData();
  return stored || getDefaultResumeData();
}
