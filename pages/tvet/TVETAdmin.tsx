import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminLogin, getSchools } from '../../services/api';
import { DegreeType, Program, NewsItem, School, EventItem, Vacancy } from '../../types';
import { Trash2, Plus, LogOut, LayoutDashboard, Newspaper, GraduationCap, AlertCircle, Calendar, Edit, Mail, X, Briefcase, ArrowLeft, Sparkles, FileText, Award, Users } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import CollapsibleSection from '../../components/admin/CollapsibleSection';
import ApplicationsManagement from '../../components/ApplicationsManagement';
import StudentApplicationsManagement from '../../components/StudentApplicationsManagement';
import { createSlug, handleApiError, getStorageItem, setStorageItem, removeStorageItem } from '../../utils';
import { STORAGE_KEYS, API_BASE_URL } from '../../constants';
import { formatDate } from '../../utils';
import { InputField, GoldButton } from '../../components';
import axios from 'axios';

/**
 * TVET Admin Panel - Manages TVET-specific content
 * All content is automatically tagged with institution="TVET"
 * Structure matches the main Admin panel exactly
 */
const TVETAdmin: React.FC = () => {
    const [token, setToken] = useState<string | null>(getStorageItem(STORAGE_KEYS.TOKEN));
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string>('');
    const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

    const [activeTab, setActiveTab] = useState<'programs' | 'news' | 'events' | 'vacancies' | 'applications' | 'student-applications'>('programs');
    const [programs, setPrograms] = useState<Program[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Delete confirmation modal
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: 'program' | 'news' | 'event' | 'vacancy' | null; id: number | null; title: string }>({
        isOpen: false,
        type: null,
        id: null,
        title: '',
    });

    const [editMode, setEditMode] = useState<{ type: 'program' | 'news' | 'event' | 'vacancy' | null; id: number | null }>({ type: null, id: null });

    // Program Form
    const [newProgram, setNewProgram] = useState({
        title: '',
        degreeType: 'Diploma' as string,
        schoolId: '',
        duration: '',
        overview: '',
        requirements: ''
    });
    const [programSubmitting, setProgramSubmitting] = useState(false);

    // News Form
    const [newArticle, setNewArticle] = useState({ title: '', summary: '', content: '', author: '' });
    const [newsSubmitting, setNewsSubmitting] = useState(false);
    const [newsImages, setNewsImages] = useState<File[]>([]);
    const [newsImagePreviews, setNewsImagePreviews] = useState<string[]>([]);
    const [newsExistingImages, setNewsExistingImages] = useState<string[]>([]);

    // Event Form
    const [newEvent, setNewEvent] = useState({ title: '', date: '', venue: '', details: '' });
    const [eventSubmitting, setEventSubmitting] = useState(false);
    const [eventImages, setEventImages] = useState<File[]>([]);
    const [eventImagePreviews, setEventImagePreviews] = useState<string[]>([]);
    const [eventExistingImages, setEventExistingImages] = useState<string[]>([]);

    // Vacancy Form
    const [newVacancy, setNewVacancy] = useState({ title: '', department: '', location: '', type: '', description: '', requirements: '', deadline: '' });
    const [vacancySubmitting, setVacancySubmitting] = useState(false);

    // TVET School ID
    const [tvetSchoolId, setTvetSchoolId] = useState<number | null>(null);

    useEffect(() => {
        if (token) {
            refreshData();
        }
    }, [token]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            removeStorageItem(STORAGE_KEYS.TOKEN);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const refreshData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getStorageItem(STORAGE_KEYS.TOKEN);
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            const [programsRes, newsRes, eventsRes, vacanciesRes, schoolsData] = await Promise.all([
                axios.get(`${API_BASE_URL}/programs?institution=TVET`, config),
                axios.get(`${API_BASE_URL}/news?institution=TVET`, config),
                axios.get(`${API_BASE_URL}/events?institution=TVET`, config),
                axios.get(`${API_BASE_URL}/vacancies?institution=TVET`, config),
                getSchools()
            ]);

            setPrograms(programsRes.data);
            setNews(newsRes.data);
            setEvents(eventsRes.data);
            setVacancies(vacanciesRes.data);
            setSchools(schoolsData);

            const tvetSchool = schoolsData.find((s: School) => s.slug === 'kemu-tvet-institute');
            if (tvetSchool) {
                setTvetSchoolId(tvetSchool.id);
                setNewProgram(prev => ({ ...prev, schoolId: tvetSchool.id.toString() }));
            }
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    // Image handling
    const handleNewsImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newFiles: File[] = Array.from(files);
        if (newsImages.length + newsExistingImages.length + newFiles.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }
        setNewsImages([...newsImages, ...newFiles]);
        newFiles.forEach((file: File) => {
            const reader = new FileReader();
            reader.onloadend = () => setNewsImagePreviews(prev => [...prev, reader.result as string]);
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
        const newFiles: File[] = Array.from(files);
        if (eventImages.length + eventExistingImages.length + newFiles.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }
        setEventImages([...eventImages, ...newFiles]);
        newFiles.forEach((file: File) => {
            const reader = new FileReader();
            reader.onloadend = () => setEventImagePreviews(prev => [...prev, reader.result as string]);
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        try {
            const res = await adminLogin({ username, password });
            if (setStorageItem(STORAGE_KEYS.TOKEN, res.token)) {
                setToken(res.token);
                setUsername('');
                setPassword('');
            }
        } catch (err) {
            setLoginError(handleApiError(err));
        }
    };

    const handleLogout = () => {
        removeStorageItem(STORAGE_KEYS.TOKEN);
        setToken(null);
    };

    // CRUD Operations
    const handleCreateProgram = async (e: React.FormEvent) => {
        e.preventDefault();
        setProgramSubmitting(true);
        try {
            const slug = createSlug(newProgram.title);
            const token = getStorageItem(STORAGE_KEYS.TOKEN);
            const data = { ...newProgram, slug, schoolId: tvetSchoolId || parseInt(newProgram.schoolId), institution: 'TVET' };

            if (editMode.type === 'program' && editMode.id) {
                await axios.put(`${API_BASE_URL}/programs/${editMode.id}`, data, { headers: { 'Authorization': `Bearer ${token}` } });
                setEditMode({ type: null, id: null });
            } else {
                await axios.post(`${API_BASE_URL}/programs`, data, { headers: { 'Authorization': `Bearer ${token}` } });
            }
            setNewProgram({ title: '', degreeType: 'Diploma', schoolId: tvetSchoolId?.toString() || '', duration: '', overview: '', requirements: '' });
            await refreshData();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setProgramSubmitting(false);
        }
    };

    const handleCreateNews = async (e: React.FormEvent) => {
        e.preventDefault();
        setNewsSubmitting(true);
        try {
            const slug = createSlug(newArticle.title);
            const formData = new FormData();
            formData.append('title', newArticle.title);
            formData.append('slug', slug);
            formData.append('summary', newArticle.summary || '');
            formData.append('content', newArticle.content);
            formData.append('author', newArticle.author || '');
            formData.append('institution', 'TVET');
            formData.append('publishedAt', new Date().toISOString());

            if (editMode.type === 'news' && editMode.id && newsExistingImages.length > 0) {
                formData.append('existingImages', JSON.stringify(newsExistingImages));
            }
            newsImages.forEach(file => formData.append('images', file));

            const token = getStorageItem(STORAGE_KEYS.TOKEN);
            const config = { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } };

            if (editMode.type === 'news' && editMode.id) {
                await axios.put(`${API_BASE_URL}/news/${editMode.id}`, formData, config);
                setEditMode({ type: null, id: null });
            } else {
                await axios.post(`${API_BASE_URL}/news`, formData, config);
            }

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

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setEventSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', newEvent.title);
            formData.append('date', newEvent.date);
            formData.append('venue', newEvent.venue);
            formData.append('details', newEvent.details || '');
            formData.append('institution', 'TVET');

            if (editMode.type === 'event' && editMode.id && eventExistingImages.length > 0) {
                formData.append('existingImages', JSON.stringify(eventExistingImages));
            }
            eventImages.forEach(file => formData.append('images', file));

            const token = getStorageItem(STORAGE_KEYS.TOKEN);
            const config = { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } };

            if (editMode.type === 'event' && editMode.id) {
                await axios.put(`${API_BASE_URL}/events/${editMode.id}`, formData, config);
                setEditMode({ type: null, id: null });
            } else {
                await axios.post(`${API_BASE_URL}/events`, formData, config);
            }

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
            formData.append('institution', 'TVET');

            const token = getStorageItem(STORAGE_KEYS.TOKEN);
            const config = { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } };

            if (editMode.type === 'vacancy' && editMode.id) {
                await axios.put(`${API_BASE_URL}/vacancies/${editMode.id}`, formData, config);
                setEditMode({ type: null, id: null });
            } else {
                await axios.post(`${API_BASE_URL}/vacancies`, formData, config);
            }

            setNewVacancy({ title: '', department: '', location: '', type: '', description: '', requirements: '', deadline: '' });
            await refreshData();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setVacancySubmitting(false);
        }
    };

    const handleEditClick = (type: 'program' | 'news' | 'event' | 'vacancy', item: any) => {
        setEditMode({ type, id: item.id });
        if (type === 'program') {
            setNewProgram({ title: item.title, degreeType: item.degreeType, schoolId: item.schoolId?.toString() || '', duration: item.duration || '', overview: item.overview || '', requirements: item.requirements || '' });
        } else if (type === 'news') {
            setNewArticle({ title: item.title, summary: item.summary || '', content: item.content || '', author: item.author || '' });
            setNewsExistingImages(item.images || []);
        } else if (type === 'event') {
            setNewEvent({ title: item.title, date: item.date ? new Date(item.date).toISOString().substring(0, 10) : '', venue: item.venue || '', details: item.details || '' });
            setEventExistingImages(item.images || []);
        } else if (type === 'vacancy') {
            setNewVacancy({ title: item.title, department: item.department, location: item.location, type: item.type, description: item.description, requirements: item.requirements, deadline: item.deadline ? new Date(item.deadline).toISOString().substring(0, 10) : '' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (type: 'program' | 'news' | 'event' | 'vacancy', id: number, title: string) => {
        setDeleteModal({ isOpen: true, type, id, title });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.id || !deleteModal.type) return;
        try {
            const token = getStorageItem(STORAGE_KEYS.TOKEN);
            const endpoint = deleteModal.type === 'program' ? 'programs' : deleteModal.type === 'news' ? 'news' : deleteModal.type === 'event' ? 'events' : 'vacancies';
            await axios.delete(`${API_BASE_URL}/${endpoint}/${deleteModal.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            await refreshData();
            setDeleteModal({ isOpen: false, type: null, id: null, title: '' });
        } catch (err) {
            setError(handleApiError(err));
            setDeleteModal({ isOpen: false, type: null, id: null, title: '' });
        }
    };

    const cancelEdit = () => {
        setEditMode({ type: null, id: null });
        setNewProgram({ title: '', degreeType: 'Diploma', schoolId: tvetSchoolId?.toString() || '', duration: '', overview: '', requirements: '' });
        setNewArticle({ title: '', summary: '', content: '', author: '' });
        setNewEvent({ title: '', date: '', venue: '', details: '' });
        setNewVacancy({ title: '', department: '', location: '', type: '', description: '', requirements: '', deadline: '' });
        setNewsImages([]); setNewsImagePreviews([]); setNewsExistingImages([]);
        setEventImages([]); setEventImagePreviews([]); setEventExistingImages([]);
    };

    const getIconForDegree = (type: string) => {
        switch (type) {
            case 'Certificate': return <FileText size={18} className="text-green-600" />;
            case 'Diploma': return <FileText size={18} className="text-blue-600" />;
            default: return <GraduationCap size={18} className="text-gray-500" />;
        }
    };

    const getColorForDegree = (type: string) => {
        switch (type) {
            case 'Certificate': return 'bg-green-600';
            case 'Diploma': return 'bg-blue-600';
            default: return 'bg-gray-500';
        }
    };

    // Login Screen
    if (!token) {
        return (
            <div className="min-h-screen bg-kemu-purple10 flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f3e7ee 0%, #dbb7cb 100%)' }}>
                <div className="glass-card bg-white/95 backdrop-blur-xl w-full max-w-md shadow-deep-3d animate-fade-up p-8 rounded-xl">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Sparkles className="text-kemu-gold" size={24} />
                        <h2 className="text-2xl font-bold text-center text-kemu-purple font-serif">TVET Admin Login</h2>
                    </div>
                    {loginError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                            <AlertCircle size={18} />
                            {loginError}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <InputField label="Email" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <GoldButton type="submit" className="w-full">Sign In</GoldButton>
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
                            <Link to="/tvet" className="bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-colors">
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                                <LayoutDashboard size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold font-serif">TVET Admin Portal</h1>
                                <p className="text-sm text-purple-100">Content Management System</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-all">
                            <LogOut size={18} className="mr-2" /> Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 max-w-7xl">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-5 py-4 rounded-lg mb-6 flex items-center gap-3 shadow-soft-3d animate-fade-up">
                        <AlertCircle size={20} className="text-red-500" />
                        <div><p className="font-semibold">Error</p><p className="text-sm">{error}</p></div>
                        <button onClick={() => setError(null)} className="ml-auto"><X size={18} /></button>
                    </div>
                )}

                {/* Professional Tab Navigation */}
                <div className="bg-white rounded-xl shadow-soft-3d border border-gray-200 p-2 mb-6 flex flex-wrap gap-2" role="tablist">
                    <button role="tab" aria-selected={activeTab === 'programs'} onClick={() => setActiveTab('programs')}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'programs' ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-purple'}`}>
                        <GraduationCap size={18} className="mr-2" /> Programs
                    </button>
                    <button role="tab" aria-selected={activeTab === 'news'} onClick={() => setActiveTab('news')}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'news' ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-purple'}`}>
                        <Newspaper size={18} className="mr-2" /> News
                    </button>
                    <button role="tab" aria-selected={activeTab === 'events'} onClick={() => setActiveTab('events')}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'events' ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-purple'}`}>
                        <Calendar size={18} className="mr-2" /> Events
                    </button>
                    <button role="tab" aria-selected={activeTab === 'vacancies'} onClick={() => setActiveTab('vacancies')}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'vacancies' ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-purple'}`}>
                        <Briefcase size={18} className="mr-2" /> Vacancies
                    </button>
                    <button role="tab" aria-selected={activeTab === 'applications'} onClick={() => setActiveTab('applications')}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'applications' ? 'bg-gradient-to-r from-kemu-gold to-kemu-purple text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-kemu-gold'}`}>
                        <Briefcase size={18} className="mr-2" /> Job Applications
                    </button>
                    <button role="tab" aria-selected={activeTab === 'student-applications'} onClick={() => setActiveTab('student-applications')}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-offset-2 transition-all duration-200 ${activeTab === 'student-applications' ? 'bg-gradient-to-r from-green-600 to-kemu-purple text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-green-600'}`}>
                        <Users size={18} className="mr-2" /> Student Applications
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
                            <div className="bg-kemu-purple10 p-3 rounded-lg"><GraduationCap size={20} className="text-kemu-purple" /></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-soft-3d border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">News</p>
                                <p className="text-2xl font-bold text-kemu-purple mt-1">{news.length}</p>
                            </div>
                            <div className="bg-kemu-purple10 p-3 rounded-lg"><Newspaper size={20} className="text-kemu-purple" /></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-soft-3d border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Events</p>
                                <p className="text-2xl font-bold text-kemu-purple mt-1">{events.length}</p>
                            </div>
                            <div className="bg-kemu-purple10 p-3 rounded-lg"><Calendar size={20} className="text-kemu-purple" /></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-soft-3d border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Vacancies</p>
                                <p className="text-2xl font-bold text-kemu-purple mt-1">{vacancies.length}</p>
                            </div>
                            <div className="bg-kemu-purple10 p-3 rounded-lg"><Briefcase size={20} className="text-kemu-purple" /></div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12"><LoadingSpinner /></div>
                ) : activeTab === 'applications' ? (
                    <ApplicationsManagement institution="TVET" onRefreshData={refreshData} />
                ) : activeTab === 'student-applications' ? (
                    <StudentApplicationsManagement institution="TVET" />
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Professional Form Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-soft-3d border border-gray-200 p-6 hover:shadow-deep-3d transition-all">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                                    <h3 className="text-lg font-bold flex items-center text-kemu-purple font-serif">
                                        <div className="bg-gradient-to-br from-kemu-purple10 to-kemu-purple30 p-2.5 rounded-lg mr-3 shadow-sm">
                                            <Plus size={20} className="text-kemu-purple" />
                                        </div>
                                        <div>
                                            <div>Add {activeTab === 'programs' ? 'Program' : activeTab === 'news' ? 'News' : activeTab === 'events' ? 'Event' : 'Vacancy'}</div>
                                            <div className="text-xs font-normal text-gray-500 mt-0.5">{editMode.id ? 'Edit existing content' : 'Create new content'}</div>
                                        </div>
                                    </h3>
                                </div>

                                {/* Programs Form */}
                                {activeTab === 'programs' && (
                                    <form onSubmit={handleCreateProgram} className="space-y-4" noValidate>
                                        <InputField label="Program Title" name="program-title" type="text" placeholder="Program Title" value={newProgram.title} onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })} required />
                                        <div>
                                            <label htmlFor="program-degree" className="block text-sm font-medium text-gray-700 mb-1">Degree Type</label>
                                            <select id="program-degree" value={newProgram.degreeType} onChange={e => setNewProgram({ ...newProgram, degreeType: e.target.value })}
                                                className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold shadow-soft-3d transition-all">
                                                <option value="Certificate">Certificate</option>
                                                <option value="Diploma">Diploma</option>
                                            </select>
                                        </div>
                                        <InputField label="Duration" name="program-duration" type="text" placeholder="e.g., 2 Years" value={newProgram.duration} onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })} />
                                        <div>
                                            <label htmlFor="program-overview" className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                                            <textarea id="program-overview" placeholder="Program overview..." value={newProgram.overview} onChange={e => setNewProgram({ ...newProgram, overview: e.target.value })}
                                                className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold shadow-soft-3d transition-all resize-none" rows={3} />
                                        </div>
                                        <div>
                                            <label htmlFor="program-requirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                                            <textarea id="program-requirements" placeholder="Entry requirements..." value={newProgram.requirements} onChange={e => setNewProgram({ ...newProgram, requirements: e.target.value })}
                                                className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold shadow-soft-3d transition-all resize-none" rows={2} />
                                        </div>
                                        <GoldButton type="submit" disabled={programSubmitting} className="w-full mt-6">
                                            {programSubmitting ? (editMode.id ? 'Updating...' : 'Creating...') : (editMode.id ? 'Update Program' : 'Create Program')}
                                        </GoldButton>
                                        {editMode.id && <button type="button" onClick={cancelEdit} className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700">Cancel Edit</button>}
                                    </form>
                                )}

                                {/* News Form */}
                                {activeTab === 'news' && (
                                    <form onSubmit={handleCreateNews} className="space-y-4" noValidate>
                                        <InputField label="Title" name="news-title" type="text" placeholder="News Title" value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} required />
                                        <InputField label="Summary" name="news-summary" type="text" placeholder="Brief summary..." value={newArticle.summary} onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })} />
                                        <div>
                                            <label htmlFor="news-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                            <textarea id="news-content" placeholder="Full article content..." value={newArticle.content} onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}
                                                className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold shadow-soft-3d transition-all resize-none" rows={5} required />
                                        </div>
                                        <InputField label="Author" name="news-author" type="text" placeholder="Author name" value={newArticle.author} onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })} />
                                        <div>
                                            <label htmlFor="news-images" className="block text-sm font-medium text-gray-700 mb-1">Images (up to 5)</label>
                                            <input id="news-images" type="file" multiple accept="image/*" onChange={handleNewsImageChange} className="w-full text-sm border-2 border-gray-200 rounded-xl p-2" />
                                            <p className="text-xs text-gray-500 mt-1">{newsImages.length + newsExistingImages.length}/5 images</p>
                                        </div>
                                        {(newsExistingImages.length > 0 || newsImagePreviews.length > 0) && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {newsExistingImages.map((url, index) => (
                                                    <div key={`existing-${index}`} className="relative group">
                                                        <img src={`http://localhost:4000${url}`} className="w-full h-24 object-cover rounded border-2 border-gray-200" alt={`Existing ${index + 1}`} />
                                                        <button type="button" onClick={() => removeNewsImage(index, true)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
                                                    </div>
                                                ))}
                                                {newsImagePreviews.map((preview, index) => (
                                                    <div key={`new-${index}`} className="relative group">
                                                        <img src={preview} className="w-full h-24 object-cover rounded border-2 border-kemu-gold" alt={`New ${index + 1}`} />
                                                        <button type="button" onClick={() => removeNewsImage(newsExistingImages.length + index, false)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <GoldButton type="submit" disabled={newsSubmitting} className="w-full mt-6">
                                            {newsSubmitting ? (editMode.id ? 'Updating...' : 'Publishing...') : (editMode.id ? 'Update News' : 'Publish News')}
                                        </GoldButton>
                                        {editMode.id && <button type="button" onClick={cancelEdit} className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700">Cancel Edit</button>}
                                    </form>
                                )}

                                {/* Events Form */}
                                {activeTab === 'events' && (
                                    <form onSubmit={handleCreateEvent} className="space-y-4" noValidate>
                                        <InputField label="Event Title" name="event-title" type="text" placeholder="Event Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
                                        <InputField label="Date" name="event-date" type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} required />
                                        <InputField label="Venue" name="event-venue" type="text" placeholder="Event venue" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} required />
                                        <div>
                                            <label htmlFor="event-details" className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                                            <textarea id="event-details" placeholder="Event details..." value={newEvent.details} onChange={e => setNewEvent({ ...newEvent, details: e.target.value })}
                                                className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold shadow-soft-3d transition-all resize-none" rows={3} />
                                        </div>
                                        <div>
                                            <label htmlFor="event-images" className="block text-sm font-medium text-gray-700 mb-1">Images (up to 5)</label>
                                            <input id="event-images" type="file" multiple accept="image/*" onChange={handleEventImageChange} className="w-full text-sm border-2 border-gray-200 rounded-xl p-2" />
                                            <p className="text-xs text-gray-500 mt-1">{eventImages.length + eventExistingImages.length}/5 images</p>
                                        </div>
                                        {(eventExistingImages.length > 0 || eventImagePreviews.length > 0) && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {eventExistingImages.map((url, index) => (
                                                    <div key={`existing-${index}`} className="relative group">
                                                        <img src={`http://localhost:4000${url}`} className="w-full h-24 object-cover rounded border-2 border-gray-200" alt={`Existing ${index + 1}`} />
                                                        <button type="button" onClick={() => removeEventImage(index, true)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
                                                    </div>
                                                ))}
                                                {eventImagePreviews.map((preview, index) => (
                                                    <div key={`new-${index}`} className="relative group">
                                                        <img src={preview} className="w-full h-24 object-cover rounded border-2 border-kemu-gold" alt={`New ${index + 1}`} />
                                                        <button type="button" onClick={() => removeEventImage(eventExistingImages.length + index, false)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <GoldButton type="submit" disabled={eventSubmitting} className="w-full mt-6">
                                            {eventSubmitting ? (editMode.id ? 'Updating...' : 'Creating...') : (editMode.id ? 'Update Event' : 'Create Event')}
                                        </GoldButton>
                                        {editMode.id && <button type="button" onClick={cancelEdit} className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700">Cancel Edit</button>}
                                    </form>
                                )}

                                {/* Vacancies Form */}
                                {activeTab === 'vacancies' && (
                                    <form onSubmit={handleCreateVacancy} className="space-y-4" noValidate>
                                        <InputField label="Position Title" name="vacancy-title" type="text" placeholder="Position Title" value={newVacancy.title} onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })} required />
                                        <InputField label="Department" name="vacancy-department" type="text" placeholder="Department" value={newVacancy.department} onChange={(e) => setNewVacancy({ ...newVacancy, department: e.target.value })} required />
                                        <InputField label="Location" name="vacancy-location" type="text" placeholder="e.g., Meru Campus" value={newVacancy.location} onChange={(e) => setNewVacancy({ ...newVacancy, location: e.target.value })} required />
                                        <div>
                                            <label htmlFor="vacancy-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <select id="vacancy-type" value={newVacancy.type} onChange={e => setNewVacancy({ ...newVacancy, type: e.target.value })}
                                                className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold shadow-soft-3d transition-all" required>
                                                <option value="">Select Type</option>
                                                <option value="Academic">Academic</option>
                                                <option value="Administrative">Administrative</option>
                                                <option value="Support Staff">Support Staff</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="vacancy-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea id="vacancy-description" placeholder="Job description..." value={newVacancy.description} onChange={e => setNewVacancy({ ...newVacancy, description: e.target.value })}
                                                className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold shadow-soft-3d transition-all resize-none" rows={3} required />
                                        </div>
                                        <div>
                                            <label htmlFor="vacancy-requirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                                            <textarea id="vacancy-requirements" placeholder="Job requirements..." value={newVacancy.requirements} onChange={e => setNewVacancy({ ...newVacancy, requirements: e.target.value })}
                                                className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemu-gold shadow-soft-3d transition-all resize-none" rows={2} required />
                                        </div>
                                        <InputField label="Deadline" name="vacancy-deadline" type="date" value={newVacancy.deadline} onChange={(e) => setNewVacancy({ ...newVacancy, deadline: e.target.value })} required />
                                        <GoldButton type="submit" disabled={vacancySubmitting} className="w-full mt-6">
                                            {vacancySubmitting ? (editMode.id ? 'Updating...' : 'Creating...') : (editMode.id ? 'Update Vacancy' : 'Create Vacancy')}
                                        </GoldButton>
                                        {editMode.id && <button type="button" onClick={cancelEdit} className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700">Cancel Edit</button>}
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Professional List Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-soft-3d border border-gray-200 overflow-hidden hover:shadow-deep-3d transition-all">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider font-serif">ID</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider font-serif">Title</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider font-serif text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {activeTab === 'programs' && (
                                                programs.length > 0 ? (
                                                    <tr>
                                                        <td colSpan={3} className="p-0">
                                                            {['Diploma', 'Certificate'].map((degreeType) => {
                                                                const filteredPrograms = programs.filter(p => p.degreeType === degreeType);
                                                                if (filteredPrograms.length === 0) return null;

                                                                return (
                                                                    <CollapsibleSection key={degreeType} title={degreeType} count={filteredPrograms.length} icon={getIconForDegree(degreeType)} colorClass={getColorForDegree(degreeType)} defaultOpen={false}>
                                                                        <table className="w-full text-left">
                                                                            <tbody className="bg-white divide-y divide-gray-100">
                                                                                {filteredPrograms.map(p => (
                                                                                    <tr key={p.id} className="hover:bg-kemu-purple10/30 transition-colors duration-150 border-b border-gray-50">
                                                                                        <td className="px-6 py-4 whitespace-nowrap w-20"><span className="text-sm font-mono text-gray-500 font-semibold">#{p.id}</span></td>
                                                                                        <td className="px-6 py-4">
                                                                                            <div className="flex flex-col">
                                                                                                <span className="text-sm font-semibold text-gray-900">{p.title}</span>
                                                                                                <span className="text-xs text-gray-500 mt-1">{p.duration}</span>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                                            <div className="flex items-center justify-end gap-2">
                                                                                                <button onClick={() => handleEditClick('program', p)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-all" title="Edit"><Edit size={16} /></button>
                                                                                                <button onClick={() => handleDeleteClick('program', p.id, p.title)} className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </CollapsibleSection>
                                                                );
                                                            })}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-12 text-center">
                                                            <GraduationCap size={48} className="mx-auto text-gray-300 mb-3" />
                                                            <p className="text-gray-500 font-medium">No programs found</p>
                                                            <p className="text-sm text-gray-400 mt-1">Create your first program to get started</p>
                                                        </td>
                                                    </tr>
                                                )
                                            )}

                                            {activeTab === 'news' && (
                                                news.length > 0 ? news.map(item => (
                                                    <tr key={item.id} className="hover:bg-kemu-purple10/30 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-mono text-gray-500">#{item.id}</span></td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                                                                <span className="text-xs text-gray-500 mt-1">{formatDate(item.publishedAt)}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button onClick={() => handleEditClick('news', item)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-all" title="Edit"><Edit size={16} /></button>
                                                                <button onClick={() => handleDeleteClick('news', item.id, item.title)} className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-12 text-center">
                                                            <Newspaper size={48} className="mx-auto text-gray-300 mb-3" />
                                                            <p className="text-gray-500 font-medium">No news found</p>
                                                            <p className="text-sm text-gray-400 mt-1">Publish your first article to get started</p>
                                                        </td>
                                                    </tr>
                                                )
                                            )}

                                            {activeTab === 'events' && (
                                                events.length > 0 ? events.map(item => (
                                                    <tr key={item.id} className="hover:bg-kemu-purple10/30 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-mono text-gray-500">#{item.id}</span></td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                                                                <span className="text-xs text-gray-500 mt-1">{formatDate(item.date)} • {item.venue}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button onClick={() => handleEditClick('event', item)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-all" title="Edit"><Edit size={16} /></button>
                                                                <button onClick={() => handleDeleteClick('event', item.id, item.title)} className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-12 text-center">
                                                            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                                                            <p className="text-gray-500 font-medium">No events found</p>
                                                            <p className="text-sm text-gray-400 mt-1">Create your first event to get started</p>
                                                        </td>
                                                    </tr>
                                                )
                                            )}

                                            {activeTab === 'vacancies' && (
                                                vacancies.length > 0 ? vacancies.map(item => (
                                                    <tr key={item.id} className="hover:bg-kemu-purple10/30 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-mono text-gray-500">#{item.id}</span></td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                                                                <span className="text-xs text-gray-500 mt-1">{item.department} • Deadline: {formatDate(item.deadline)}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button onClick={() => handleEditClick('vacancy', item)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-all" title="Edit"><Edit size={16} /></button>
                                                                <button onClick={() => handleDeleteClick('vacancy', item.id, item.title)} className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-12 text-center">
                                                            <Briefcase size={48} className="mx-auto text-gray-300 mb-3" />
                                                            <p className="text-gray-500 font-medium">No vacancies found</p>
                                                            <p className="text-sm text-gray-400 mt-1">Create your first vacancy to get started</p>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, type: null, id: null, title: '' })} title="Confirm Delete">
                <p className="text-gray-600 mb-6">Are you sure you want to delete "<strong>{deleteModal.title}</strong>"? This action cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={() => setDeleteModal({ isOpen: false, type: null, id: null, title: '' })} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
                </div>
            </Modal>
        </div>
    );
};

export default TVETAdmin;
