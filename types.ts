export enum DegreeType {
  Undergraduate = 'Undergraduate',
  Postgraduate = 'Postgraduate',
  Certificate = 'Certificate'
}

export interface Program {
  id: number;
  title: string;
  slug: string;
  degreeType: DegreeType;
  faculty?: string;
  schoolId?: number;
  school?: {
    id: number;
    name: string;
    slug: string;
  };
  duration: string;
  overview: string;
  image?: string;
  requirements?: string;
}

export interface School {
  id: number;
  name: string;
  slug: string;
  overview?: string;
  programs?: Program[];
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  publishedAt: string;
  author: string;
  images?: string[]; // Array of image URLs
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  venue: string;
  description?: string;
  details?: string;
  images?: string[]; // Array of image URLs
}

export interface Vacancy {
  id: number;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  deadline: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'hired';

export interface Application {
  id: number;
  vacancyId: number;
  vacancy?: Vacancy;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  cvPath: string;
  documents?: string[];
  status: ApplicationStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  programs: number;
  news: number;
  events: number;
  students: number;
  campuses: number;
}
