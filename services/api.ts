import axios from 'axios';
import { Program, NewsItem, EventItem, Stats, DegreeType } from '../types';
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
    const token = localStorage.getItem('kemu_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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
      const message = error.response.data?.message || 'An error occurred';
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

export const getPrograms = async (query?: string, degree?: string): Promise<Program[]> => {
  const params: any = {};
  if (query) params.q = query;
  if (degree && degree !== 'All') params.degree = degree;
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

export const getNews = async (): Promise<NewsItem[]> => {
  const res = await api.get('/news');
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

export const getEvents = async (): Promise<EventItem[]> => {
  const res = await api.get('/events');
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
export const getVacancies = async (): Promise<any[]> => {
  const response = await api.get('/vacancies');
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

export const getApplications = async (filters?: { status?: string; vacancyId?: number; search?: string }): Promise<any[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.vacancyId) params.append('vacancyId', filters.vacancyId.toString());
  if (filters?.search) params.append('search', filters.search);

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

export default api;

