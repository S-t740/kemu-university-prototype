export enum DegreeType {
  Certificate = 'Certificate',
  Diploma = 'Diploma',
  Degree = 'Degree',
  Masters = 'Masters',
  PhD = 'PhD',
  Postgraduate = 'Postgraduate'
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
  institution?: string;  // 'TVET' or 'MAIN' for filtering
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

export interface Directorate {
  id: number;
  name: string;
  slug: string;
  overview?: string;
}

// ==================== STUDENT APPLICATION TYPES ====================

export type StudentApplicationStatus = 'new' | 'received' | 'reviewing' | 'shortlisted' | 'offered' | 'rejected';
export type ApplicationType = 'Direct' | 'KUCCPS' | 'Sponsored';
export type PaymentStatus = 'pending' | 'paid' | 'waived';
export type IntakePeriod = 'January' | 'May' | 'September';

export interface EducationEntry {
  id?: string;
  level: string;  // KCSE, Diploma, Degree, etc.
  institution: string;
  award: string;
  year: string;
  grade: string;
}

export interface StudentApplication {
  id: number;
  applicationId: string;  // KEMU-2024-00001 or TVET-2024-00001

  // Applicant Profile
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  nationalId: string;
  dateOfBirth: string;
  nationality: string;
  physicalAddress: string;

  // Programme Selection
  programId: number;
  program?: Program;
  intake: IntakePeriod;
  applicationType: ApplicationType;
  kuccpsRefNumber?: string;
  sponsorDetails?: string;

  // Education History
  educationHistory: EducationEntry[] | string;

  // Documents
  passportPhoto?: string;
  nationalIdDoc?: string;
  academicCerts?: string[] | string;
  supportingDocs?: string[] | string;

  // Payment
  applicationFee: number;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  paymentMethod?: string;
  mpesaReceiptNumber?: string;

  // Workflow
  status: StudentApplicationStatus;
  adminNotes?: string;
  offerLetterPath?: string;

  // Institution Scope
  institution: 'KEMU' | 'TVET';

  // Consent
  declarationAccepted: boolean;
  privacyConsent: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

export interface StudentApplicationFormData {
  // Step 1: Applicant Profile
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  nationalId: string;
  dateOfBirth: string;
  nationality: string;
  physicalAddress: string;

  // Step 2: Programme Selection
  programId: number | null;
  intake: IntakePeriod | '';
  applicationType: ApplicationType | '';
  kuccpsRefNumber?: string;
  sponsorDetails?: string;

  // Step 3: Education History
  educationHistory: EducationEntry[];

  // Step 4: Documents
  passportPhoto?: string;
  nationalIdDoc?: string;
  academicCerts?: string[];
  supportingDocs?: string[];

  // Step 5: Payment
  paymentMethod?: string;
  paymentReference?: string;
  mpesaReceiptNumber?: string;

  // Step 6: Consent
  declarationAccepted: boolean;
  privacyConsent: boolean;

  // Institution
  institution: 'KEMU' | 'TVET';
}

export interface StudentApplicationStats {
  total: number;
  recentWeek: number;
  byStatus: Record<StudentApplicationStatus, number>;
  byIntake: Record<string, number>;
}

export interface PhoneCountry {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
}

// Applicant Account System
export interface Applicant {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  phoneCode?: string;
  nationalId?: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface ApplicantAuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  applicant?: Applicant;
  error?: string;
}

export interface ApplicantApplicationsResponse {
  success: boolean;
  applications: StudentApplication[];
  stats: {
    total: number;
    pending: number;
    offered: number;
    rejected: number;
  };
}
