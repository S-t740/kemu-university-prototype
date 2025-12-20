import axios from 'axios';
import { Program, NewsItem, EventItem, Stats, DegreeType, StudentApplication, StudentApplicationFormData, StudentApplicationStats, Applicant, ApplicantAuthResponse, ApplicantApplicationsResponse } from '../types';
import { API_BASE_URL, API_TIMEOUT } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    // Only add admin token if Authorization header is not already set
    // This allows applicant APIs to set their own token
    if (!config.headers['Authorization']) {
      const token = localStorage.getItem('kemu_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Check for both 'error' and 'message' fields (different endpoints use different formats)
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
    }
  }
);

export const getStats = async (): Promise<Stats> => {
  const res = await api.get('/stats');
  return res.data;
};

export const getPrograms = async (query?: string, degree?: string, institution?: string): Promise<Program[]> => {
  const params: any = {};
  if (query) params.q = query;
  if (degree && degree !== 'All') params.degree = degree;
  if (institution) params.institution = institution;
  const res = await api.get('/programs', { params });
  return res.data;
};

export const getProgramBySlug = async (slug: string): Promise<Program | undefined> => {
  const res = await api.get(`/programs/${slug}`);
  return res.data;
};

export const createProgram = async (program: any): Promise<Program> => {
  const res = await api.post('/programs', program);
  return res.data;
};

export const updateProgram = async (id: number, program: any): Promise<Program> => {
  const res = await api.put(`/programs/${id}`, program);
  return res.data;
};

export const deleteProgram = async (id: number): Promise<void> => {
  await api.delete(`/programs/${id}`);
}

export const getNews = async (options?: { institution?: string; excludeInstitution?: string }): Promise<NewsItem[]> => {
  const params: any = {};
  if (options?.institution) params.institution = options.institution;
  if (options?.excludeInstitution) params.excludeInstitution = options.excludeInstitution;
  const res = await api.get('/news', { params });
  return res.data;
};

export const getNewsBySlug = async (slug: string): Promise<NewsItem | undefined> => {
  const res = await api.get(`/news/${slug}`);
  return res.data;
};

export const createNews = async (news: any): Promise<NewsItem> => {
  const res = await api.post('/news', news);
  return res.data;
};

export const updateNews = async (id: number, news: any): Promise<NewsItem> => {
  const res = await api.put(`/news/${id}`, news);
  return res.data;
};

export const deleteNews = async (id: number): Promise<void> => {
  await api.delete(`/news/${id}`);
}

export const getEvents = async (options?: { institution?: string; excludeInstitution?: string }): Promise<EventItem[]> => {
  const params: any = {};
  if (options?.institution) params.institution = options.institution;
  if (options?.excludeInstitution) params.excludeInstitution = options.excludeInstitution;
  const res = await api.get('/events', { params });
  return res.data;
};

export const adminLogin = async (credentials: any): Promise<{ token: string }> => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

// Start: Add schools fetch for dropdowns
export const getSchools = async (): Promise<any[]> => {
  const res = await api.get('/schools');
  return res.data;
}

export const createSchool = async (school: any): Promise<any> => {
  const res = await api.post('/schools', school);
  return res.data;
};

export const updateSchool = async (id: number, school: any): Promise<any> => {
  const res = await api.put(`/schools/${id}`, school);
  return res.data;
};

export const deleteSchool = async (id: number): Promise<void> => {
  await api.delete(`/schools/${id}`);
}

// Events CRUD
export const createEvent = async (event: any): Promise<any> => {
  const res = await api.post('/events', event);
  return res.data;
};

export const updateEvent = async (id: number, event: any): Promise<any> => {
  const res = await api.put(`/events/${id}`, event);
  return res.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/${id}`);
}


// Vacancy APIs
export const getVacancies = async (options?: { institution?: string; excludeInstitution?: string }): Promise<any[]> => {
  const params: any = {};
  if (options?.institution) params.institution = options.institution;
  if (options?.excludeInstitution) params.excludeInstitution = options.excludeInstitution;
  const response = await api.get('/vacancies', { params });
  return response.data;
};


export const getAllVacancies = async (): Promise<any[]> => {
  const response = await api.get('/vacancies/all');
  return response.data;
};

export const getVacancyBySlug = async (slug: string): Promise<any> => {
  const response = await api.get(`/vacancies/${slug}`);
  return response.data;
};

export const deleteVacancy = async (id: number): Promise<void> => {
  await api.delete(`/vacancies/${id}`);
};

export const createVacancy = async (formData: FormData): Promise<any> => {
  const response = await api.post('/vacancies', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateVacancy = async (id: number, formData: FormData): Promise<any> => {
  const response = await api.put(`/vacancies/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};



// Inquiry APIs
export const createInquiry = async (data: { name: string; email: string; message: string; source: string }): Promise<any> => {
  const response = await api.post('/inquiries', data);
  return response.data;
};

export const getInquiries = async (): Promise<any[]> => {
  const response = await api.get('/inquiries');
  return response.data;
};

export const getInquiry = async (id: number): Promise<any> => {
  const response = await api.get(`/inquiries/${id}`);
  return response.data;
};

export const toggleInquiryRead = async (id: number): Promise<any> => {
  const response = await api.put(`/inquiries/${id}/mark-read`);
  return response.data;
};

export const deleteInquiry = async (id: number): Promise<void> => {
  await api.delete(`/inquiries/${id}`);
};

// Application APIs
export const submitApplication = async (formData: FormData): Promise<any> => {
  const response = await api.post('/applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getApplications = async (filters?: { status?: string; vacancyId?: number; search?: string; institution?: string; excludeInstitution?: string }): Promise<any[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.vacancyId) params.append('vacancyId', filters.vacancyId.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.institution) params.append('institution', filters.institution);
  if (filters?.excludeInstitution) params.append('excludeInstitution', filters.excludeInstitution);

  const response = await api.get(`/applications?${params.toString()}`);
  return response.data;
};



export const getApplicationsByVacancy = async (vacancyId: number): Promise<any[]> => {
  const response = await api.get(`/applications/vacancy/${vacancyId}`);
  return response.data;
};

export const getApplication = async (id: number): Promise<any> => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

export const getApplicationStats = async (): Promise<any> => {
  const response = await api.get('/applications/stats');
  return response.data;
};

export const updateApplicationStatus = async (id: number, status: string, adminNotes?: string): Promise<any> => {
  const response = await api.put(`/applications/${id}/status`, { status, adminNotes });
  return response.data;
};

export const deleteApplication = async (id: number): Promise<void> => {
  await api.delete(`/applications/${id}`);
};

// Student Services APIs
export interface StudentService {
  id: number;
  slug: string;
  title: string;
  summary: string;
  details: string[];
  url?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getStudentServices = async (): Promise<StudentService[]> => {
  const response = await api.get('/student-services');
  return response.data;
};

export const getStudentServiceBySlug = async (slug: string): Promise<StudentService> => {
  const response = await api.get(`/student-services/${slug}`);
  return response.data;
};

export const createStudentService = async (data: Partial<StudentService>): Promise<StudentService> => {
  const response = await api.post('/student-services', data);
  return response.data;
};

export const updateStudentService = async (id: number, data: Partial<StudentService>): Promise<StudentService> => {
  const response = await api.put(`/student-services/${id}`, data);
  return response.data;
};

export const deleteStudentService = async (id: number): Promise<void> => {
  await api.delete(`/student-services/${id}`);
};

// Directorate APIs
export const getDirectorates = async (): Promise<any[]> => {
  const res = await api.get('/directorates');
  return res.data;
};

export const createDirectorate = async (directorate: any): Promise<any> => {
  const res = await api.post('/directorates', directorate);
  return res.data;
};

export const updateDirectorate = async (id: number, directorate: any): Promise<any> => {
  const res = await api.put(`/directorates/${id}`, directorate);
  return res.data;
};

export const deleteDirectorate = async (id: number): Promise<void> => {
  await api.delete(`/directorates/${id}`);
};

// ==================== STUDENT APPLICATION APIs ====================

// Submit new student application
export const submitStudentApplication = async (data: StudentApplicationFormData): Promise<{ success: boolean; applicationId: string; application: StudentApplication }> => {
  const response = await api.post('/student-applications', data);
  return response.data;
};

// Check application status (public)
export const getStudentApplicationStatus = async (applicationId: string): Promise<Partial<StudentApplication>> => {
  const response = await api.get(`/student-applications/${applicationId}/status`);
  return response.data;
};

// Upload documents
export const uploadStudentDocuments = async (formData: FormData): Promise<{ success: boolean; files: Record<string, string | string[]> }> => {
  const response = await api.post('/student-applications/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// MPESA STK Push
export const initiateMpesaPayment = async (phone: string, amount: number, applicationId: string): Promise<{ success: boolean; checkoutRequestId: string; message: string; stub?: boolean; instructions?: string[] }> => {
  const response = await api.post('/student-applications/payment/mpesa/stk-push', { phone, amount, applicationId });
  return response.data;
};

// Verify MPESA payment
export const verifyMpesaPayment = async (applicationId: string, mpesaReceiptNumber: string, checkoutRequestId?: string): Promise<{ success: boolean; paymentStatus: string }> => {
  const response = await api.post('/student-applications/payment/mpesa/verify', { applicationId, mpesaReceiptNumber, checkoutRequestId });
  return response.data;
};

// Admin: Get all applications
export const getStudentApplications = async (filters?: {
  institution?: string;
  status?: string;
  intake?: string;
  programId?: number;
  search?: string;
  page?: number;
  limit?: number
}): Promise<{ applications: StudentApplication[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> => {
  const params = new URLSearchParams();
  if (filters?.institution) params.append('institution', filters.institution);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.intake) params.append('intake', filters.intake);
  if (filters?.programId) params.append('programId', filters.programId.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await api.get(`/student-applications/admin/all?${params.toString()}`);
  return response.data;
};

// Admin: Get application statistics
export const getStudentApplicationStats = async (institution?: string): Promise<StudentApplicationStats> => {
  const params = institution ? `?institution=${institution}` : '';
  const response = await api.get(`/student-applications/admin/stats${params}`);
  return response.data;
};

// Admin: Get single application detail
export const getStudentApplicationDetail = async (id: number): Promise<StudentApplication> => {
  const response = await api.get(`/student-applications/admin/${id}`);
  return response.data;
};

// Admin: Update application status
export const updateStudentApplicationStatus = async (id: number, status: string, adminNotes?: string): Promise<{ success: boolean; application: StudentApplication }> => {
  const response = await api.put(`/student-applications/admin/${id}/status`, { status, adminNotes });
  return response.data;
};

// Admin: Add notes
export const addStudentApplicationNotes = async (id: number, notes: string): Promise<{ success: boolean }> => {
  const response = await api.post(`/student-applications/admin/${id}/notes`, { notes });
  return response.data;
};

// Admin: Update payment status (fee waiver)
export const updateStudentApplicationPayment = async (id: number, paymentStatus: string, paymentReference?: string): Promise<{ success: boolean }> => {
  const response = await api.put(`/student-applications/admin/${id}/payment`, { paymentStatus, paymentReference });
  return response.data;
};

// Admin: Delete application
export const deleteStudentApplication = async (id: number): Promise<void> => {
  await api.delete(`/student-applications/admin/${id}`);
};

// ============================================
// Applicant Account APIs
// ============================================

const APPLICANT_TOKEN_KEY = 'kemu_applicant_token';

// Helper to get applicant token
const getApplicantHeaders = () => {
  const token = localStorage.getItem(APPLICANT_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Register new applicant (sends OTP)
export const registerApplicant = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  phoneCode?: string;
  nationalId?: string;
  otpMethod?: 'email' | 'phone';
}): Promise<ApplicantAuthResponse & { requiresVerification?: boolean }> => {
  const response = await api.post('/applicant/register', data);
  return response.data;
};

// Verify OTP and complete registration
export const verifyOTP = async (email: string, otp: string): Promise<ApplicantAuthResponse> => {
  const response = await api.post('/applicant/verify-otp', { email, otp });
  return response.data;
};

// Resend OTP
export const resendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/applicant/resend-otp', { email });
  return response.data;
};

// Login applicant
export const loginApplicant = async (email: string, password: string): Promise<ApplicantAuthResponse> => {
  const response = await api.post('/applicant/login', { email, password });
  return response.data;
};

// Get current applicant profile
export const getApplicantProfile = async (): Promise<{ success: boolean; applicant: Applicant }> => {
  const response = await api.get('/applicant/me', { headers: getApplicantHeaders() });
  return response.data;
};

// Update applicant profile
export const updateApplicantProfile = async (data: Partial<Applicant>): Promise<{ success: boolean; applicant: Applicant }> => {
  const response = await api.put('/applicant/profile', data, { headers: getApplicantHeaders() });
  return response.data;
};

// Get applicant's applications
export const getApplicantApplications = async (): Promise<ApplicantApplicationsResponse> => {
  const response = await api.get('/applicant/applications', { headers: getApplicantHeaders() });
  return response.data;
};

// Change password
export const changeApplicantPassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/applicant/change-password', { currentPassword, newPassword }, { headers: getApplicantHeaders() });
  return response.data;
};

// Link existing application to account
export const linkApplicationToAccount = async (applicationId: string, nationalId?: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/applicant/link-application', { applicationId, nationalId }, { headers: getApplicantHeaders() });
  return response.data;
};

export default api;

