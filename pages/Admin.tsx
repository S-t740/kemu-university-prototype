import React, { useState, useEffect } from 'react';
import { adminLogin, createProgram, createNews, updateProgram, updateNews, deleteProgram, deleteNews, getPrograms, getNews, getSchools, createSchool, updateSchool, deleteSchool, getEvents, createEvent, updateEvent, deleteEvent, getAllVacancies, createVacancy, updateVacancy, deleteVacancy, getInquiries, toggleInquiryRead, deleteInquiry } from '../services/api';
import { DegreeType, Program, NewsItem, School, EventItem, Vacancy } from '../types';
import { Trash2, Plus, LogOut, LayoutDashboard, Newspaper, GraduationCap, AlertCircle, Calendar, Edit, Building, Mail, MailOpen, Eye, X, Briefcase, Users } from 'lucide-react';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { programSchema, newsSchema, loginSchema, schoolSchema, eventSchema, type ProgramFormData, type NewsFormData, type LoginFormData, type SchoolFormData, type EventFormData } from '../utils/validation';
import { createSlug, handleApiError, getStorageItem, setStorageItem, removeStorageItem } from '../utils';
import { STORAGE_KEYS, DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD, API_BASE_URL } from '../constants';
import { formatDate } from '../utils';
import { InputField, DashboardCard, GlassSection, GoldButton } from '../components';
import axios from 'axios';
import ApplicationsManagement from '../components/ApplicationsManagement';
import StudentServicesManagement from '../components/StudentServicesManagement';
import { BookOpen } from 'lucide-react';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  message: string;
  source: string;
  isRead: boolean;
  createdAt: string;
}

const Admin: React.FC = () => {
  const [token, setToken] = useState<string | null>(getStorageItem(STORAGE_KEYS.TOKEN));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string>('');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  const [activeTab, setActiveTab] = useState<'programs' | 'news' | 'schools' | 'events' | 'vacancies' | 'applications' | 'studentServices' | 'inbox'>('programs');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete confirmation modal
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: 'program' | 'news' | 'school' | 'event' | 'vacancy' | 'inquiry' | null; id: number | null; title: string }>({
    isOpen: false,
    type: null,
    id: null,
    title: '',
  });

  const [editMode, setEditMode] = useState<{ type: 'program' | 'news' | 'school' | 'event' | 'vacancy' | null; id: number | null }>({ type: null, id: null });

  // Forms
  const [newProgram, setNewProgram] = useState<ProgramFormData>({
    title: '',
    degreeType: DegreeType.Undergraduate,
    schoolId: '',
    duration: '',
    overview: ''
  });
  const [programErrors, setProgramErrors] = useState<Record<string, string>>({});
  const [programSubmitting, setProgramSubmitting] = useState(false);

  const [newArticle, setNewArticle] = useState<NewsFormData>({
    title: '',
    summary: '',
    content: '',
    author: ''
  });
  const [newsErrors, setNewsErrors] = useState<Record<string, string>>({});
  const [newsSubmitting, setNewsSubmitting] = useState(false);
  const [newsImages, setNewsImages] = useState<File[]>([]);
  const [newsImagePreviews, setNewsImagePreviews] = useState<string[]>([]);
  const [newsExistingImages, setNewsExistingImages] = useState<string[]>([]);

  const [newSchool, setNewSchool] = useState<SchoolFormData>({ name: '', overview: '' });
  const [schoolErrors, setSchoolErrors] = useState<Record<string, string>>({});
  const [schoolSubmitting, setSchoolSubmitting] = useState(false);

  const [newEvent, setNewEvent] = useState<EventFormData>({ title: '', date: '', venue: '', details: '' });
  const [eventErrors, setEventErrors] = useState<Record<string, string>>({});
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [eventImages, setEventImages] = useState<File[]>([]);
  const [eventImagePreviews, setEventImagePreviews] = useState<string[]>([]);
  const [eventExistingImages, setEventExistingImages] = useState<string[]>([]);

  const [newVacancy, setNewVacancy] = useState({ title: '', department: '', location: '', type: '', description: '', requirements: '', deadline: '' });
  const [vacancyErrors, setVacancyErrors] = useState<Record<string, string>>({});
  const [vacancySubmitting, setVacancySubmitting] = useState(false);
  const [vacancyImages, setVacancyImages] = useState<File[]>([]);
  const [vacancyImagePreviews, setVacancyImagePreviews] = useState<string[]>([]);
  const [vacancyExistingImages, setVacancyExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (token) {
      refreshData();
    }
  }, [token]);

  // Security: Clear session when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      removeStorageItem(STORAGE_KEYS.TOKEN);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pData, nData, sData, eData, vData, iData] = await Promise.all([
        getPrograms(),
        getNews(),
        getSchools(),
        getEvents(),
        getAllVacancies(),
        getInquiries()
      ]);
      setPrograms(pData);
      setNews(nData);
      setSchools(sData);
      setEvents(eData);
      setVacancies(vData);
      setInquiries(iData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Image handling helper functions
  const handleNewsImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = newsImages.length + newsExistingImages.length + newFiles.length;

    if (totalImages > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setNewsImages([...newsImages, ...newFiles]);

    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewsImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewsImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setNewsExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - newsExistingImages.length;
      setNewsImages(prev => prev.filter((_, i) => i !== newIndex));
      setNewsImagePreviews(prev => prev.filter((_, i) => i !== newIndex));
    }
  };

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = eventImages.length + eventExistingImages.length + newFiles.length;

    if (totalImages > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setEventImages([...eventImages, ...newFiles]);

    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEventImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setEventExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - eventExistingImages.length;
      setEventImages(prev => prev.filter((_, i) => i !== newIndex));
      setEventImagePreviews(prev => prev.filter((_, i) => i !== newIndex));
    }
  };

  const handleVacancyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = vacancyImages.length + vacancyExistingImages.length + newFiles.length;

    if (totalImages > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setVacancyImages(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVacancyImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeVacancyImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setVacancyExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - vacancyExistingImages.length;
      setVacancyImages(prev => prev.filter((_, i) => i !== newIndex));
      setVacancyImagePreviews(prev => prev.filter((_, i) => i !== newIndex));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginErrors({});

    const formData: LoginFormData = { username, password };

    // Validate
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setLoginErrors(errors);
      return;
    }

    try {
      const res = await adminLogin(formData);
      if (setStorageItem(STORAGE_KEYS.TOKEN, res.token)) {
        setToken(res.token);
        setLoginError('');
        setUsername('');
        setPassword('');
      } else {
        setLoginError('Failed to save authentication token');
      }
    } catch (err) {
      setLoginError(handleApiError(err));
    }
  };

  const handleLogout = () => {
    removeStorageItem(STORAGE_KEYS.TOKEN);
    setToken(null);
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setProgramErrors({});
    setProgramSubmitting(true);

    // Validate
    const result = programSchema.safeParse(newProgram);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setProgramErrors(errors);
      setProgramSubmitting(false);
      return;
    }

    try {
      const slug = createSlug(newProgram.title);
      if (editMode.type === 'program' && editMode.id) {
        await updateProgram(editMode.id, { ...newProgram, slug });
        setEditMode({ type: null, id: null });
      } else {
        await createProgram({ ...newProgram, slug });
      }
      setNewProgram({ title: '', degreeType: DegreeType.Undergraduate, schoolId: '', duration: '', overview: '' });
      await refreshData();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setProgramSubmitting(false);
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsErrors({});
    setNewsSubmitting(true);

    // Validate
    const result = newsSchema.safeParse(newArticle);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setNewsErrors(errors);
      setNewsSubmitting(false);
      return;
    }

    try {
      const slug = createSlug(newArticle.title);
      const formData = new FormData();

      formData.append('title', newArticle.title);
      formData.append('slug', slug);
      formData.append('summary', newArticle.summary || '');
      formData.append('content', newArticle.content);
      formData.append('author', newArticle.author || '');
      formData.append('publishedAt', new Date().toISOString());

      // Add existing images for edit mode
      if (editMode.type === 'news' && editMode.id && newsExistingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(newsExistingImages));
      }

      // Add new image files
      newsImages.forEach(file => {
        formData.append('images', file);
      });

      const token = getStorageItem(STORAGE_KEYS.TOKEN);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };

      if (editMode.type === 'news' && editMode.id) {
        await axios.put(`${API_BASE_URL}/news/${editMode.id}`, formData, config);
        setEditMode({ type: null, id: null });
      } else {
        await axios.post(`${API_BASE_URL}/news`, formData, config);
      }

      // Reset form
      setNewArticle({ title: '', summary: '', content: '', author: '' });
      setNewsImages([]);
      setNewsImagePreviews([]);
      setNewsExistingImages([]);
      await refreshData();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setNewsSubmitting(false);
    }
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolErrors({});
    setSchoolSubmitting(true);

    const result = schoolSchema.safeParse(newSchool);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setSchoolErrors(errors);
      setSchoolSubmitting(false);
      return;
    }

    try {
      const slug = createSlug(newSchool.name);
      if (editMode.type === 'school' && editMode.id) {
        await updateSchool(editMode.id, { ...newSchool, slug });
        setEditMode({ type: null, id: null });
      } else {
        await createSchool({ ...newSchool, slug });
      }
      setNewSchool({ name: '', overview: '' });
      await refreshData();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSchoolSubmitting(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventErrors({});
    setEventSubmitting(true);

    const result = eventSchema.safeParse(newEvent);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setEventErrors(errors);
      setEventSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append('title', newEvent.title);
      formData.append('date', newEvent.date);
      formData.append('venue', newEvent.venue);
      formData.append('details', newEvent.details || '');

      // Add existing images for edit mode
      if (editMode.type === 'event' && editMode.id && eventExistingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(eventExistingImages));
      }

      // Add new image files
      eventImages.forEach(file => {
        formData.append('images', file);
      });

      const token = getStorageItem(STORAGE_KEYS.TOKEN);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };

      if (editMode.type === 'event' && editMode.id) {
        await axios.put(`${API_BASE_URL}/events/${editMode.id}`, formData, config);
        setEditMode({ type: null, id: null });
      } else {
        await axios.post(`${API_BASE_URL}/events`, formData, config);
      }

      // Reset form
      setNewEvent({ title: '', date: '', venue: '', details: '' });
      setEventImages([]);
      setEventImagePreviews([]);
      setEventExistingImages([]);
      await refreshData();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setEventSubmitting(false);
    }
  };

  const handleCreateVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    setVacancyErrors({});
    setVacancySubmitting(true);

    try {
      const formData = new FormData();

      formData.append('title', newVacancy.title);
      formData.append('slug', createSlug(newVacancy.title));
      formData.append('department', newVacancy.department);
      formData.append('location', newVacancy.location);
      formData.append('type', newVacancy.type);
      formData.append('description', newVacancy.description);
      formData.append('requirements', newVacancy.requirements);
      formData.append('deadline', newVacancy.deadline);

      if (editMode.type === 'vacancy' && editMode.id && vacancyExistingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(vacancyExistingImages));
      }

      vacancyImages.forEach(file => {
        formData.append('images', file);
      });

      const token = getStorageItem(STORAGE_KEYS.TOKEN);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };

      if (editMode.type === 'vacancy' && editMode.id) {
        await axios.put(`${API_BASE_URL}/vacancies/${editMode.id}`, formData, config);
      } else {
        await axios.post(`${API_BASE_URL}/vacancies`, formData, config);
      }

      setNewVacancy({ title: '', department: '', location: '', type: '', description: '', requirements: '', deadline: '' });
      setEditMode({ type: null, id: null });
      setVacancyImages([]);
      setVacancyImagePreviews([]);
      setVacancyExistingImages([]);
      await refreshData();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setVacancySubmitting(false);
    }
  };

  const handleEditClick = (type: 'program' | 'news' | 'school' | 'event' | 'vacancy', item: any) => {
    setEditMode({ type, id: item.id });
    if (type === 'program') {
      setNewProgram({
        title: item.title,
        degreeType: item.degreeType,
        schoolId: item.schoolId ? item.schoolId.toString() : (item.school?.id?.toString() || ''),
        duration: item.duration || '',
        overview: item.overview || '',
      });
    } else if (type === 'news') {
      setNewArticle({
        title: item.title,
        summary: item.summary || '',
        content: item.content || '',
        author: item.author || '',
      });
      // Load existing images
      setNewsExistingImages(item.images || []);
      setNewsImages([]);
      setNewsImagePreviews([]);
    } else if (type === 'school') {
      setNewSchool({
        name: item.name,
        overview: item.overview || '',
      });
    } else if (type === 'event') {
      setNewEvent({
        title: item.title,
        date: item.date ? new Date(item.date).toISOString().substring(0, 10) : '',
        venue: item.venue || '',
        details: item.details || '',
      });
      // Load existing images
      setEventExistingImages(item.images || []);
      setEventImages([]);
      setEventImagePreviews([]);
    } else if (type === 'vacancy') {
      setNewVacancy({
        title: item.title,
        department: item.department,
        location: item.location,
        type: item.type,
        description: item.description,
        requirements: item.requirements,
        deadline: item.deadline ? new Date(item.deadline).toISOString().substring(0, 10) : '',
      });
      setVacancyExistingImages(item.images || []);
      setVacancyImages([]);
      setVacancyImagePreviews([]);
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (type: 'program' | 'news' | 'school' | 'event' | 'vacancy' | 'inquiry', id: number, title: string) => {
    setDeleteModal({ isOpen: true, type, id, title });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.id || !deleteModal.type) return;

    try {
      if (deleteModal.type === 'program') {
        await deleteProgram(deleteModal.id);
      } else if (deleteModal.type === 'news') {
        await deleteNews(deleteModal.id);
      } else if (deleteModal.type === 'school') {
        await deleteSchool(deleteModal.id);
      } else if (deleteModal.type === 'event') {
        await deleteEvent(deleteModal.id);
      } else if (deleteModal.type === 'vacancy') {
        await deleteVacancy(deleteModal.id);
      } else if (deleteModal.type === 'inquiry') {
        await deleteInquiry(deleteModal.id);
      }
      await refreshData();
      setDeleteModal({ isOpen: false, type: null, id: null, title: '' });
      if (selectedInquiry?.id === deleteModal.id) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      setError(handleApiError(err));
      // Close modal anyway on success, but keep open on error? Actually usually better to close or show error in modal. 
      // Current design shows global error.
      setDeleteModal({ isOpen: false, type: null, id: null, title: '' });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-kemu-purple10 flex items-center justify-center px-4" style={{
        background: 'linear-gradient(135deg, #f3e7ee 0%, #dbb7cb 100%)',
      }}>
        <div className="glass-card bg-white/95 backdrop-blur-xl w-full max-w-md shadow-deep-3d animate-fade-up">
          <h2 className="text-2xl font-bold mb-6 text-center text-kemu-purple font-serif">Admin Login</h2>
          {loginError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2 shadow-soft-3d" role="alert">
              <AlertCircle size={18} />
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <InputField
              label="Email"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={loginErrors.username}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={loginErrors.password}
              required
            />
            <GoldButton type="submit" className="w-full">
              Sign In
            </GoldButton>

          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kemu-purple10 via-white to-kemu-purple10 flex flex-col">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-kemu-purple via-kemu-purple to-kemu-blue text-white shadow-deep-3d">
        <div className="container mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <LayoutDashboard size={24} aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif">Admin Portal</h1>
                <p className="text-sm text-purple-100">Content Management System</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg flex items-center font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
              aria-label="Logout"
            >
              <LogOut size={18} className="mr-2" aria-hidden="true" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-5 py-4 rounded-lg mb-6 flex items-center gap-3 shadow-soft-3d animate-fade-up" role="alert">
            <AlertCircle size={20} className="text-red-500" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Professional Tab Navigation */}
        <div className="bg-white rounded-xl shadow-soft-3d border border-gray-200 p-2 mb-6 flex flex-wrap gap-2" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'programs'}
            onClick={() => setActiveTab('programs')}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'programs'
              ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-purple'
              }`}
          >
            <GraduationCap size={18} className="mr-2" aria-hidden="true" /> Programs
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'news'}
            onClick={() => setActiveTab('news')}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'news'
              ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-purple'
              }`}
          >
            <Newspaper size={18} className="mr-2" aria-hidden="true" /> News
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'schools'}
            onClick={() => setActiveTab('schools')}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'schools'
              ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-purple'
              }`}
          >
            <Building size={18} className="mr-2" aria-hidden="true" /> Schools
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'events'}
            onClick={() => setActiveTab('events')}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'events'
              ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-purple'
              }`}
          >
            <Calendar size={18} className="mr-2" aria-hidden="true" /> Events
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'vacancies'}
            onClick={() => setActiveTab('vacancies')}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'vacancies'
              ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-purple'
              }`}
          >
            <Briefcase size={18} className="mr-2" aria-hidden="true" /> Vacancies
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'applications'}
            onClick={() => setActiveTab('applications')}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'applications'
              ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-purple'
              }`}
          >
            <Users size={18} className="mr-2" aria-hidden="true" /> Applications
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'inbox'}
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'inbox'
              ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-purple'
              }`}
          >
            <Mail size={18} className="mr-2" aria-hidden="true" /> Inbox {inquiries.filter(inq => !inq.isRead).length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{inquiries.filter(inq => !inq.isRead).length}</span>
            )}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'studentServices'}
            onClick={() => setActiveTab('studentServices')}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'studentServices'
              ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-purple'
              }`}
          >
            <BookOpen size={18} className="mr-2" aria-hidden="true" /> Student Services
          </button>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-soft-3d border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Programs</p>
                <p className="text-2xl font-bold text-kemu-purple mt-1">{programs.length}</p>
              </div>
              <div className="bg-kemu-purple10 p-3 rounded-lg">
                <GraduationCap size={20} className="text-kemu-purple" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-soft-3d border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">News</p>
                <p className="text-2xl font-bold text-kemu-purple mt-1">{news.length}</p>
              </div>
              <div className="bg-kemu-purple10 p-3 rounded-lg">
                <Newspaper size={20} className="text-kemu-purple" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-soft-3d border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Schools</p>
                <p className="text-2xl font-bold text-kemu-purple mt-1">{schools.length}</p>
              </div>
              <div className="bg-kemu-purple10 p-3 rounded-lg">
                <Building size={20} className="text-kemu-purple" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Only show for non-applications and non-studentServices tabs */}
        {activeTab !== 'applications' && activeTab !== 'studentServices' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Professional Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-soft-3d border border-gray-200 p-6 hover:shadow-deep-3d transition-all">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold flex items-center text-kemu-purple font-serif">
                    <div className="bg-gradient-to-br from-kemu-purple10 to-kemu-purple30 p-2.5 rounded-lg mr-3 shadow-sm">
                      <Plus size={20} className="text-kemu-purple" aria-hidden="true" />
                    </div>
                    <div>
                      <div>Add {activeTab === 'programs' ? 'Program' : activeTab === 'news' ? 'News' : 'School'}</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">{editMode.id ? 'Edit existing content' : 'Create new content'}</div>
                    </div>
                  </h3>
                </div>

                {activeTab === 'programs' ? (
                  <form onSubmit={handleCreateProgram} className="space-y-4" noValidate>
                    <InputField
                      label="Program Title"
                      name="program-title"
                      type="text"
                      placeholder="Program Title"
                      value={newProgram.title}
                      onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                      error={programErrors.title}
                      required
                    />
                    <div>
                      <label htmlFor="program-degree" className="block text-sm font-medium text-gray-700 mb-1">Degree Type</label>
                      <select
                        id="program-degree"
                        value={newProgram.degreeType}
                        onChange={e => setNewProgram({ ...newProgram, degreeType: e.target.value as DegreeType })}
                        className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold shadow-soft-3d transition-all"
                      >
                        <option value={DegreeType.Undergraduate}>Undergraduate</option>
                        <option value={DegreeType.Postgraduate}>Postgraduate</option>
                        <option value={DegreeType.Certificate}>Certificate</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="program-school" className="block text-sm font-medium text-gray-700 mb-1">School</label>
                      <select
                        id="program-school"
                        value={newProgram.schoolId}
                        onChange={e => setNewProgram({ ...newProgram, schoolId: e.target.value })}
                        className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold shadow-soft-3d transition-all"
                      >
                        <option value="">Select School</option>
                        {schools.map(school => (
                          <option key={school.id} value={school.id.toString()}>{school.name}</option>
                        ))}
                      </select>
                      {programErrors.schoolId && (
                        <p className="mt-1 text-xs text-red-600">{programErrors.schoolId}</p>
                      )}
                    </div>
                    <InputField
                      label="Duration"
                      name="program-duration"
                      type="text"
                      placeholder="Duration (e.g. 4 Years)"
                      value={newProgram.duration}
                      onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })}
                      error={programErrors.duration}
                      required
                    />
                    <div>
                      <label htmlFor="program-overview" className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                      <textarea
                        id="program-overview"
                        placeholder="Overview"
                        value={newProgram.overview}
                        onChange={e => setNewProgram({ ...newProgram, overview: e.target.value })}
                        className={`w-full bg-white/90 backdrop-blur-sm border-2 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold shadow-soft-3d transition-all resize-none ${programErrors.overview ? 'border-red-500' : 'border-gray-200 focus:border-kemu-gold'
                          }`}
                        rows={4}
                        required
                        aria-invalid={!!programErrors.overview}
                        aria-describedby={programErrors.overview ? 'program-overview-error' : undefined}
                      />
                      {programErrors.overview && (
                        <p id="program-overview-error" className="mt-1 text-xs text-red-600" role="alert">
                          {programErrors.overview}
                        </p>
                      )}
                    </div>
                    <GoldButton
                      type="submit"
                      disabled={programSubmitting}
                      className="w-full mt-6"
                    >
                      {programSubmitting ? (editMode.id ? 'Updating...' : 'Creating...') : (editMode.id ? 'Update Program' : 'Create Program')}
                    </GoldButton>
                    {editMode.id && (
                      <button type="button" onClick={() => { setEditMode({ type: null, id: null }); setNewProgram({ title: '', degreeType: DegreeType.Undergraduate, schoolId: '', duration: '', overview: '' }); }} className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700">Cancel Edit</button>
                    )}
                  </form>
                ) : activeTab === 'news' ? (
                  <form onSubmit={handleCreateNews} className="space-y-4" noValidate>
                    <InputField
                      label="Headline"
                      name="news-title"
                      type="text"
                      placeholder="Headline"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                      error={newsErrors.title}
                      required
                    />
                    <InputField
                      label="Author"
                      name="news-author"
                      type="text"
                      placeholder="Author"
                      value={newArticle.author}
                      onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                      error={newsErrors.author}
                      required
                    />
                    <div>
                      <label htmlFor="news-summary" className="block text-sm font-medium text-gray-700 mb-1">Short Summary</label>
                      <textarea
                        id="news-summary"
                        placeholder="Short Summary"
                        value={newArticle.summary}
                        onChange={e => setNewArticle({ ...newArticle, summary: e.target.value })}
                        className={`w-full bg-white/90 backdrop-blur-sm border-2 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold shadow-soft-3d transition-all resize-none ${newsErrors.summary ? 'border-red-500' : 'border-gray-200 focus:border-kemu-gold'
                          }`}
                        rows={2}
                        required
                        aria-invalid={!!newsErrors.summary}
                        aria-describedby={newsErrors.summary ? 'news-summary-error' : undefined}
                      />
                      {newsErrors.summary && (
                        <p id="news-summary-error" className="mt-1 text-xs text-red-600" role="alert">
                          {newsErrors.summary}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="news-content" className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                      <textarea
                        id="news-content"
                        placeholder="Full Content"
                        value={newArticle.content}
                        onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}
                        className={`w-full bg-white/90 backdrop-blur-sm border-2 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold shadow-soft-3d transition-all resize-none ${newsErrors.content ? 'border-red-500' : 'border-gray-200 focus:border-kemu-gold'
                          }`}
                        rows={5}
                        required
                        aria-invalid={!!newsErrors.content}
                        aria-describedby={newsErrors.content ? 'news-content-error' : undefined}
                      />
                      {newsErrors.content && (
                        <p id="news-content-error" className="mt-1 text-xs text-red-600" role="alert">
                          {newsErrors.content}
                        </p>
                      )}\n                  </div>

                    {/* Image Upload Section */}
                    <div>
                      <label htmlFor="news-images" className="block text-sm font-medium text-gray-700 mb-1">
                        Images (up to 5)
                      </label>
                      <input
                        id="news-images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleNewsImageChange}
                        className="w-full text-sm border-2 border-gray-200 rounded-xl p-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {newsImages.length + newsExistingImages.length}/5 images
                      </p>
                    </div>

                    {/* Image Previews */}
                    {(newsExistingImages.length > 0 || newsImagePreviews.length > 0) && (
                      <div className="grid grid-cols-3 gap-2">
                        {newsExistingImages.map((url, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <img
                              src={`http://localhost:4000${url}`}
                              className="w-full h-24 object-cover rounded border-2 border-gray-200"
                              alt={`Existing ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeNewsImage(index, true)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        {newsImagePreviews.map((preview, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <img
                              src={preview}
                              className="w-full h-24 object-cover rounded border-2 border-kemu-gold"
                              alt={`New ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeNewsImage(newsExistingImages.length + index, false)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <GoldButton
                      type="submit"
                      disabled={newsSubmitting}
                      className="w-full mt-6"
                    >
                      {newsSubmitting ? (editMode.id ? 'Updating...' : 'Publishing...') : (editMode.id ? 'Update News' : 'Publish News')}
                    </GoldButton>
                    {editMode.id && (
                      <button type="button" onClick={() => { setEditMode({ type: null, id: null }); setNewArticle({ title: '', summary: '', content: '', author: '' }); }} className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700">Cancel Edit</button>
                    )}
                  </form>
                ) : activeTab === 'schools' ? (
                  <form onSubmit={handleCreateSchool} className="space-y-4" noValidate>
                    <InputField
                      label="School Name"
                      name="school-name"
                      type="text"
                      placeholder="School Name"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                      error={schoolErrors.name}
                      required
                    />
                    <div>
                      <label htmlFor="school-overview" className="block text-sm font-medium text-gray-700 mb-1">Overview (Optional)</label>
                      <textarea
                        id="school-overview"
                        placeholder="Short description of the school..."
                        value={newSchool.overview}
                        onChange={e => setNewSchool({ ...newSchool, overview: e.target.value })}
                        className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold shadow-soft-3d transition-all resize-none"
                        rows={3}
                      />
                    </div>
                    <GoldButton
                      type="submit"
                      disabled={schoolSubmitting}
                      className="w-full mt-6"
                    >
                      {schoolSubmitting ? (editMode.id ? 'Updating...' : 'Adding...') : (editMode.id ? 'Update School' : 'Add School')}
                    </GoldButton>
                    {editMode.id && (
                      <button type="button" onClick={() => { setEditMode({ type: null, id: null }); setNewSchool({ name: '', overview: '' }); }} className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700">Cancel Edit</button>
                    )}
                  </form>
                ) : activeTab === 'events' ? (
                  <form onSubmit={handleCreateEvent} className="space-y-4" noValidate>
                    <InputField
                      label="Event Title"
                      name="event-title"
                      type="text"
                      placeholder="Event Title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      error={eventErrors.title}
                      required
                    />
                    <InputField
                      label="Date"
                      name="event-date"
                      type="date"
                      placeholder="Event Date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      error={eventErrors.date}
                      required
                    />
                    <InputField
                      label="Venue"
                      name="event-venue"
                      type="text"
                      placeholder="Venue"
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                      error={eventErrors.venue}
                      required
                    />
                    <div>
                      <label htmlFor="event-details" className="block text-sm font-medium text-gray-700 mb-1">Details (Optional)</label>
                      <textarea
                        id="event-details"
                        placeholder="Event details..."
                        value={newEvent.details}
                        onChange={e => setNewEvent({ ...newEvent, details: e.target.value })}
                        className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold shadow-soft-3d transition-all resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <label htmlFor="event-images" className="block text-sm font-medium text-gray-700 mb-1">
                        Images (up to 5)
                      </label>
                      <input
                        id="event-images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleEventImageChange}
                        className="w-full text-sm border-2 border-gray-200 rounded-xl p-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {eventImages.length + eventExistingImages.length}/5 images
                      </p>
                    </div>

                    {/* Image Previews */}
                    {(eventExistingImages.length > 0 || eventImagePreviews.length > 0) && (
                      <div className="grid grid-cols-3 gap-2">
                        {eventExistingImages.map((url, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <img
                              src={`http://localhost:4000${url}`}
                              className="w-full h-24 object-cover rounded border-2 border-gray-200"
                              alt={`Existing ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeEventImage(index, true)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        {eventImagePreviews.map((preview, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <img
                              src={preview}
                              className="w-full h-24 object-cover rounded border-2 border-kemu-gold"
                              alt={`New ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeEventImage(eventExistingImages.length + index, false)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <GoldButton
                      type="submit"
                      disabled={eventSubmitting}
                      className="w-full mt-6"
                    >
                      {eventSubmitting ? (editMode.id ? 'Updating...' : 'Adding...') : (editMode.id ? 'Update Event' : 'Add Event')}
                    </GoldButton>
                    {editMode.id && (
                      <button type="button" onClick={() => { setEditMode({ type: null, id: null }); setNewEvent({ title: '', date: '', venue: '', details: '' }); }} className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700">Cancel Edit</button>
                    )}
                  </form>
                ) : null}
              </div>
            </div>

            {/* Professional List Section */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="bg-white rounded-xl shadow-soft-3d border border-gray-200 flex justify-center items-center py-16">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-soft-3d border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-kemu-purple10 to-kemu-purple30 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-kemu-purple font-serif">
                      {activeTab === 'programs' ? 'All Programs' : activeTab === 'news' ? 'All News Articles' : 'All Schools'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {activeTab === 'programs' ? `${programs.length} total programs` : activeTab === 'news' ? `${news.length} total articles` : `${schools.length} total schools`}
                    </p>           </div>
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider font-serif">ID</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider font-serif">Title</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider font-serif text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {activeTab === 'programs' ? (
                          programs.length > 0 ? (
                            programs.map(p => (
                              <tr key={p.id} className="hover:bg-kemu-purple10/30 transition-colors duration-150 border-b border-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm font-mono text-gray-500 font-semibold">#{p.id}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">{p.title}</span>
                                    <span className="text-xs text-kemu-purple font-medium mt-1 inline-flex items-center">
                                      <GraduationCap size={12} className="mr-1" />
                                      {p.degreeType}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleEditClick('program', p)}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                      aria-label={`Edit program: ${p.title}`}
                                      title="Edit"
                                    >
                                      <Edit size={16} aria-hidden="true" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick('program', p.id, p.title)}
                                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                                      aria-label={`Delete program: ${p.title}`}
                                      title="Delete"
                                    >
                                      <Trash2 size={16} aria-hidden="true" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center">
                                  <GraduationCap size={48} className="text-gray-300 mb-3" />
                                  <p className="text-gray-500 font-medium">No programs found</p>
                                  <p className="text-sm text-gray-400 mt-1">Create your first program to get started</p>
                                </div>
                              </td>
                            </tr>
                          )
                        ) : activeTab === 'news' ? (
                          news.length > 0 ? (
                            news.map(n => (
                              <tr key={n.id} className="hover:bg-kemu-purple10/30 transition-colors duration-150 border-b border-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm font-mono text-gray-500 font-semibold">#{n.id}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">{n.title}</span>
                                    <span className="text-xs text-kemu-purple font-medium mt-1 inline-flex items-center">
                                      <Calendar size={12} className="mr-1" />
                                      {formatDate(n.publishedAt)}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleEditClick('news', n)}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                      aria-label={`Edit news: ${n.title}`}
                                      title="Edit"
                                    >
                                      <Edit size={16} aria-hidden="true" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick('news', n.id, n.title)}
                                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                                      aria-label={`Delete news: ${n.title}`}
                                      title="Delete"
                                    >
                                      <Trash2 size={16} aria-hidden="true" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center">
                                  <Newspaper size={48} className="text-gray-300 mb-3" />
                                  <p className="text-gray-500 font-medium">No news articles found</p>
                                  <p className="text-sm text-gray-400 mt-1">Create your first article to get started</p>
                                </div>
                              </td>
                            </tr>
                          )
                        ) : activeTab === 'schools' ? (
                          schools.length > 0 ? (
                            schools.map(s => (
                              <tr key={s.id} className="hover:bg-kemu-purple10/30 transition-colors duration-150 border-b border-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm font-mono text-gray-500 font-semibold">#{s.id}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                                    {s.overview && (
                                      <span className="text-xs text-gray-500 mt-1">{s.overview}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleEditClick('school', s)}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                      aria-label={`Edit school: ${s.name}`}
                                      title="Edit"
                                    >
                                      <Edit size={16} aria-hidden="true" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick('school', s.id, s.name)}
                                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                                      aria-label={`Delete school: ${s.name}`}
                                      title="Delete"
                                    >
                                      <Trash2 size={16} aria-hidden="true" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center">
                                  <Building size={48} className="text-gray-300 mb-3" />
                                  <p className="text-gray-500 font-medium">No schools found</p>
                                  <p className="text-sm text-gray-400 mt-1">Create your first school to get started</p>
                                </div>
                              </td>
                            </tr>
                          )
                        ) : activeTab === 'events' ? (
                          events.length > 0 ? (
                            events.map(e => (
                              <tr key={e.id} className="hover:bg-kemu-purple10/30 transition-colors duration-150 border-b border-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm font-mono text-gray-500 font-semibold">#{e.id}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">{e.title}</span>
                                    <span className="text-xs text-kemu-purple font-medium mt-1 inline-flex items-center">
                                      <Calendar size={12} className="mr-1" />
                                      {formatDate(e.date)} - {e.venue}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleEditClick('event', e)}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                      aria-label={`Edit event: ${e.title}`}
                                      title="Edit"
                                    >
                                      <Edit size={16} aria-hidden="true" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick('event', e.id, e.title)}
                                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                                      aria-label={`Delete event: ${e.title}`}
                                      title="Delete"
                                    >
                                      <Trash2 size={16} aria-hidden="true" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center">
                                  <Calendar size={48} className="text-gray-300 mb-3" />
                                  <p className="text-gray-500 font-medium">No events found</p>
                                  <p className="text-sm text-gray-400 mt-1">Create your first event to get started</p>
                                </div>
                              </td>
                            </tr>
                          )
                        ) : activeTab === 'vacancies' ? (
                          <GlassSection title={editMode.type === 'vacancy' && editMode.id ? 'Edit Vacancy' : 'Job Vacancies Management'}>
                            <form onSubmit={handleCreateVacancy} className="space-y-6 mb-8">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                  label="Job Title"
                                  value={newVacancy.title}
                                  onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
                                  error={vacancyErrors.title}
                                  required
                                  placeholder="e.g., Lecturer in Computer Science"
                                />
                                <InputField
                                  label="Department"
                                  value={newVacancy.department}
                                  onChange={(e) => setNewVacancy({ ...newVacancy, department: e.target.value })}
                                  error={vacancyErrors.department}
                                  required
                                  placeholder="e.g., School of Computing and Informatics"
                                />
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                                  <select
                                    value={newVacancy.location}
                                    onChange={(e) => setNewVacancy({ ...newVacancy, location: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold transition-all"
                                    required
                                  >
                                    <option value="">Select Location</option>
                                    <option value="Meru Campus">Meru Campus</option>
                                    <option value="Nairobi Campus">Nairobi Campus</option>
                                    <option value="Mombasa Campus">Mombasa Campus</option>
                                    <option value="All Campuses">All Campuses</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">Position Type *</label>
                                  <select
                                    value={newVacancy.type}
                                    onChange={(e) => setNewVacancy({ ...newVacancy, type: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold transition-all"
                                    required
                                  >
                                    <option value="">Select Type</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Administrative">Administrative</option>
                                    <option value="Support Staff">Support Staff</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                                <InputField
                                  label="Application Deadline"
                                  type="date"
                                  value={newVacancy.deadline}
                                  onChange={(e) => setNewVacancy({ ...newVacancy, deadline: e.target.value })}
                                  error={vacancyErrors.deadline}
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
                                <textarea
                                  value={newVacancy.description}
                                  onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold transition-all"
                                  rows={4}
                                  required
                                  placeholder="Detailed job description..."
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements *</label>
                                <textarea
                                  value={newVacancy.requirements}
                                  onChange={(e) => setNewVacancy({ ...newVacancy, requirements: e.target.value })}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold transition-all"
                                  rows={4}
                                  required
                                  placeholder="Required qualifications and experience..."
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Images (Optional, max 5)</label>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleVacancyImageChange}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold transition-all"
                                />
                                {(vacancyImagePreviews.length > 0 || vacancyExistingImages.length > 0) && (
                                  <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                      {vacancyExistingImages.length + vacancyImagePreviews.length}/5 images selected
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                      {vacancyExistingImages.map((img, index) => (
                                        <div key={`existing-${index}`} className="relative group">
                                          <img src={`http://localhost:4000${img}`} alt={`Existing ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">Existing</div>
                                          <button
                                            type="button"
                                            onClick={() => removeVacancyImage(index, true)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <X size={16} />
                                          </button>
                                        </div>
                                      ))}
                                      {vacancyImagePreviews.map((preview, index) => (
                                        <div key={`new-${index}`} className="relative group">
                                          <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">New</div>
                                          <button
                                            type="button"
                                            onClick={() => removeVacancyImage(vacancyExistingImages.length + index, false)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <X size={16} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-4">
                                <GoldButton type="submit" disabled={vacancySubmitting}>
                                  {vacancySubmitting ? 'Saving...' : (editMode.type === 'vacancy' && editMode.id ? 'Update Vacancy' : 'Create Vacancy')}
                                </GoldButton>
                                {editMode.type === 'vacancy' && editMode.id && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditMode({ type: null, id: null });
                                      setNewVacancy({ title: '', department: '', location: '', type: '', description: '', requirements: '', deadline: '' });
                                      setVacancyImages([]);
                                      setVacancyImagePreviews([]);
                                      setVacancyExistingImages([]);
                                    }}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                                  >
                                    Cancel Edit
                                  </button>
                                )}
                              </div>
                            </form>

                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gradient-to-r from-kemu-purple/10 to-kemu-blue/10">
                                  <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Position</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Deadline</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white/50 divide-y divide-gray-100">
                                  {vacancies.map((vacancy) => (
                                    <tr key={vacancy.id} className="hover:bg-white/80 transition-colors duration-150">
                                      <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{vacancy.title}</span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{vacancy.department}</span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{vacancy.location}</span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${vacancy.type === 'Academic' ? 'bg-purple-100 text-purple-800' :
                                          vacancy.type === 'Administrative' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                          }`}>
                                          {vacancy.type}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className={`text-sm ${new Date(vacancy.deadline) < new Date() ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                          {formatDate(vacancy.deadline)}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                          <button
                                            onClick={() => handleEditClick('vacancy', vacancy)}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                            aria-label={`Edit vacancy: ${vacancy.title}`}
                                            title="Edit"
                                          >
                                            <Edit size={16} aria-hidden="true" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteClick('vacancy', vacancy.id, vacancy.title)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                                            aria-label={`Delete vacancy: ${vacancy.title}`}
                                            title="Delete"
                                          >
                                            <Trash2 size={16} aria-hidden="true" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                  {vacancies.length === 0 && (
                                    <tr>
                                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No vacancies posted yet. Create your first job posting above.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </GlassSection>
                        ) : activeTab === 'inbox' ? (
                          inquiries.length > 0 ? (
                            inquiries.map(inquiry => (
                              <tr key={inquiry.id} className={`cursor-pointer transition-colors duration-150 border-b border-gray-50 ${!inquiry.isRead ? 'bg-purple-50/20' : 'hover:bg-purple-50/10'}`}
                                onClick={() => setSelectedInquiry(inquiry)}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {inquiry.isRead ? (
                                    <MailOpen className="text-gray-400" size={20} />
                                  ) : (
                                    <Mail className="text-kemu-purple" size={20} />
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`font-medium ${!inquiry.isRead ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                    {inquiry.name}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm text-gray-600">{inquiry.email}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${inquiry.source === 'chatbot' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {inquiry.source === 'chatbot' ? '💬 Chatbot' : '📧 Contact'}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm text-gray-500">{formatDate(inquiry.createdAt)}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setSelectedInquiry(inquiry); }}
                                      className="p-2 bg-kemu-gold/10 hover:bg-kemu-gold/20 text-kemu-gold rounded-lg transition-colors"
                                      title="View details"
                                    >
                                      <Eye size={16} />
                                    </button>
                                    <button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        await toggleInquiryRead(inquiry.id);
                                        await refreshData();
                                      }}
                                      className="p-2 bg-kemu-purple/10 hover:bg-kemu-purple/20 text-kemu-purple rounded-lg transition-colors"
                                      title={inquiry.isRead ? 'Mark as unread' : 'Mark as read'}
                                    >
                                      {inquiry.isRead ? <Mail size={16} /> : <MailOpen size={16} />}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick('inquiry', inquiry.id, inquiry.name);
                                      }}
                                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center">
                                  <Mail size={48} className="text-gray-300 mb-3" />
                                  <p className="text-gray-500 font-medium">No inquiries found</p>
                                  <p className="text-sm text-gray-400 mt-1">Inquiries from the chatbot and contact form will appear here</p>
                                </div>
                              </td>
                            </tr>
                          )
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Applications Tab - Standalone Full-Width Section */}
        {activeTab === 'applications' && (
          <div className="mt-6">
            <ApplicationsManagement onRefreshData={refreshData} />
          </div>
        )}

        {/* Student Services Tab - Standalone Full-Width Section */}
        {activeTab === 'studentServices' && (
          <div className="mt-6">
            <StudentServicesManagement />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, type: null, id: null, title: '' })}
          onConfirm={handleDeleteConfirm}
          title={`Delete ${deleteModal.type === 'program' ? 'Program' : deleteModal.type === 'news' ? 'News' : deleteModal.type === 'inquiry' ? 'Inquiry' : deleteModal.type === 'event' ? 'Event' : 'School'}?`}
          message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />

        {/* Inquiry Detail Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={() => setSelectedInquiry(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-kemu-purple to-kemu-blue p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedInquiry.name}</h2>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-white/90 hover:text-white underline text-sm"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white`}>
                    {selectedInquiry.source === 'chatbot' ? '💬 Chatbot' : '📧 Contact Form'}
                  </span>
                  <span className="text-white/80 text-sm">{formatDate(selectedInquiry.createdAt)}</span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Message</h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: Your inquiry&body=Hi ${selectedInquiry.name},%0D%0A%0D%0A`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-kemu-gold to-kemu-gold/90 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  <Mail size={18} />
                  Reply via Email
                </a>
                <button
                  onClick={async () => {
                    await toggleInquiryRead(selectedInquiry.id);
                    await refreshData();
                    setSelectedInquiry(null);
                  }}
                  className="px-4 py-3 bg-kemu-purple/10 hover:bg-kemu-purple/20 text-kemu-purple rounded-xl transition-colors font-medium"
                >
                  Mark as {selectedInquiry.isRead ? 'Unread' : 'Read'}
                </button>
                <button
                  onClick={() => {
                    handleDeleteClick('inquiry', selectedInquiry.id, selectedInquiry.name);
                    setSelectedInquiry(null);
                  }}
                  className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-up overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{deleteModal.title}"</span>?
              </p>
              <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, type: null, id: null, title: '' })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
