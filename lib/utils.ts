import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResumeData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export function getDefaultResumeData(): ResumeData {
  return {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    theme: {
      template: 'modern' as const,
      primaryColor: '#3b82f6',
      darkMode: false,
    },
  };
}

export function getExampleResumeData(): ResumeData {
  return {
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading cross-functional teams.',
    },
    experiences: [
      {
        id: generateId(),
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2021-01-01',
        endDate: '',
        current: true,
        description: 'Led development of microservices architecture serving 1M+ users. Mentored junior developers and established CI/CD pipelines reducing deployment time by 60%.',
      },
      {
        id: generateId(),
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        location: 'Remote',
        startDate: '2019-06-01',
        endDate: '2020-12-31',
        current: false,
        description: 'Built responsive web applications using React and Node.js. Collaborated with design team to implement pixel-perfect UIs and optimized database queries improving performance by 40%.',
      },
    ],
    education: [
      {
        id: generateId(),
        institution: 'University of California',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'Berkeley, CA',
        startDate: '2015-09-01',
        endDate: '2019-05-31',
        current: false,
        gpa: '3.8',
        description: 'Relevant coursework: Data Structures, Algorithms, Database Systems, Software Engineering',
      },
    ],
    skills: [
      { id: generateId(), name: 'React', level: 'expert' as const },
      { id: generateId(), name: 'TypeScript', level: 'expert' as const },
      { id: generateId(), name: 'Node.js', level: 'advanced' as const },
      { id: generateId(), name: 'Python', level: 'advanced' as const },
      { id: generateId(), name: 'AWS', level: 'intermediate' as const },
      { id: generateId(), name: 'Docker', level: 'intermediate' as const },
    ],
    projects: [
      {
        id: generateId(),
        name: 'E-Commerce Platform',
        description: 'Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.',
        url: 'https://github.com/johndoe/ecommerce',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      },
      {
        id: generateId(),
        name: 'Task Management App',
        description: 'Developed a collaborative task management application with real-time updates using WebSockets and React.',
        url: 'https://github.com/johndoe/taskapp',
        technologies: ['React', 'Socket.io', 'MongoDB'],
      },
    ],
    theme: {
      template: 'modern' as const,
      primaryColor: '#3b82f6',
      darkMode: false,
    },
  };
}
