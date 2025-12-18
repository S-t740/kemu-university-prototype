import React, { useState, useEffect } from 'react';
import { Application, ApplicationStatus, Vacancy } from '../types';
import { getApplications, getAllVacancies, updateApplicationStatus, deleteApplication } from '../services/api';
import { formatDate, handleApiError } from '../utils';
import { Search, Filter, Download, Eye, Trash2, User, Mail, Phone, FileText, Calendar, Briefcase, ChevronDown, X, CheckCircle, Clock, XCircle, Users as UsersIcon } from 'lucide-react';
import Modal from '../components/Modal';
import { API_BASE_URL } from '../constants';

// Base URL for uploaded files (removes /api from API_BASE_URL)
const UPLOADS_BASE_URL = API_BASE_URL.replace('/api', '');

interface ApplicationsManagementProps {
    onRefreshData?: () => Promise<void>;
    institution?: string;  // Optional: filter applications by vacancy institution (e.g., 'TVET')
    excludeInstitution?: string;  // Optional: exclude applications from a specific institution
}


const statusColors: Record<ApplicationStatus, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
    reviewing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Under Review' },
    shortlisted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Shortlisted' },
    interview: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Interview Scheduled' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    hired: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Hired' }
};

const ApplicationsManagement: React.FC<ApplicationsManagementProps> = ({ onRefreshData, institution, excludeInstitution }) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [vacancyFilter, setVacancyFilter] = useState<string>('all');

    // Selected application for detail view
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');

    // Delete modal
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; application: Application | null }>({
        isOpen: false,
        application: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Build filter object based on props
            const filters: { institution?: string; excludeInstitution?: string } = {};
            if (institution) filters.institution = institution;
            if (excludeInstitution) filters.excludeInstitution = excludeInstitution;

            const [appsData, vacanciesData] = await Promise.all([
                getApplications(Object.keys(filters).length > 0 ? filters : undefined),
                getAllVacancies()
            ]);
            // Filter vacancies based on institution/excludeInstitution
            let filteredVacancies = vacanciesData;
            if (institution) {
                filteredVacancies = vacanciesData.filter((v: Vacancy) => v.institution === institution);
            } else if (excludeInstitution) {
                filteredVacancies = vacanciesData.filter((v: Vacancy) => v.institution !== excludeInstitution);
            }
            setApplications(appsData);
            setVacancies(filteredVacancies);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        const matchesVacancy = vacancyFilter === 'all' || app.vacancyId.toString() === vacancyFilter;
        return matchesSearch && matchesStatus && matchesVacancy;
    });

    const handleStatusChange = async (newStatus: ApplicationStatus) => {
        if (!selectedApplication) return;

        setStatusUpdating(true);
        try {
            await updateApplicationStatus(selectedApplication.id, newStatus, adminNotes || undefined);
            await fetchData();
            setSelectedApplication(prev => prev ? { ...prev, status: newStatus, adminNotes: adminNotes || prev.adminNotes } : null);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setStatusUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.application) return;

        try {
            await deleteApplication(deleteModal.application.id);
            await fetchData();
            setDeleteModal({ isOpen: false, application: null });
            if (selectedApplication?.id === deleteModal.application.id) {
                setSelectedApplication(null);
            }
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    const openDetailView = (app: Application) => {
        setSelectedApplication(app);
        setAdminNotes(app.adminNotes || '');
    };

    // Stats
    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
        hired: applications.filter(a => a.status === 'hired').length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-kemu-purple border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[60vh]">
            {/* Error Alert */}
            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-r-xl flex items-center justify-between shadow-sm">
                    <span className="font-medium">{error}</span>
                    <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Stats Cards Row - Full Width */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border border-gray-100/80 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs md:text-sm text-gray-500 uppercase font-semibold tracking-wide">Total Applications</p>
                            <p className="text-2xl md:text-3xl font-bold text-kemu-purple mt-1">{stats.total}</p>
                        </div>
                        <div className="p-3 md:p-4 bg-gradient-to-br from-kemu-purple/20 to-kemu-purple/10 rounded-xl flex-shrink-0">
                            <UsersIcon className="text-kemu-purple" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border border-gray-100/80 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs md:text-sm text-gray-500 uppercase font-semibold tracking-wide">Pending Review</p>
                            <p className="text-2xl md:text-3xl font-bold text-amber-600 mt-1">{stats.pending}</p>
                        </div>
                        <div className="p-3 md:p-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex-shrink-0">
                            <Clock className="text-amber-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border border-gray-100/80 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs md:text-sm text-gray-500 uppercase font-semibold tracking-wide">Shortlisted</p>
                            <p className="text-2xl md:text-3xl font-bold text-green-600 mt-1">{stats.shortlisted}</p>
                        </div>
                        <div className="p-3 md:p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex-shrink-0">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border border-gray-100/80 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs md:text-sm text-gray-500 uppercase font-semibold tracking-wide">Hired</p>
                            <p className="text-2xl md:text-3xl font-bold text-emerald-600 mt-1">{stats.hired}</p>
                        </div>
                        <div className="p-3 md:p-4 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex-shrink-0">
                            <Briefcase className="text-emerald-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Applications Panel - Full Width Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden">
                {/* Panel Header */}
                <div className="px-6 md:px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                        <span className="w-1.5 h-7 bg-gradient-to-b from-kemu-purple to-kemu-blue rounded-full mr-3"></span>
                        Applications
                    </h2>
                </div>

                {/* Filters Section */}
                <div className="px-6 md:px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <Search size={16} className="mr-2 text-gray-400" />
                                Search Applicants
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-purple/30 focus:border-kemu-purple transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <Filter size={16} className="mr-2 text-gray-400" />
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-purple/30 focus:border-kemu-purple transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                {Object.entries(statusColors).map(([key, { label }]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <Briefcase size={16} className="mr-2 text-gray-400" />
                                Vacancy
                            </label>
                            <select
                                value={vacancyFilter}
                                onChange={(e) => setVacancyFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-purple/30 focus:border-kemu-purple transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">All Vacancies</option>
                                {vacancies.map(v => (
                                    <option key={v.id} value={v.id.toString()}>{v.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Applications Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Applied</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApplications.map(app => (
                                <tr key={app.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-kemu-purple/20 to-kemu-blue/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                                <User className="text-kemu-purple" size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{app.firstName} {app.lastName}</p>
                                                <p className="text-sm text-gray-500">{app.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="font-medium text-gray-800">{app.vacancy?.title || 'Unknown Position'}</p>
                                        <p className="text-sm text-gray-500">{app.vacancy?.department}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${statusColors[app.status].bg} ${statusColors[app.status].text}`}>
                                            {statusColors[app.status].label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-medium text-gray-600">{formatDate(app.createdAt)}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openDetailView(app)}
                                                className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all hover:scale-105 shadow-sm"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <a
                                                href={`${UPLOADS_BASE_URL}${app.cvPath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all hover:scale-105 shadow-sm"
                                                title="Download CV"
                                            >
                                                <Download size={18} />
                                            </a>
                                            <button
                                                onClick={() => setDeleteModal({ isOpen: true, application: app })}
                                                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all hover:scale-105 shadow-sm"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredApplications.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                                                <UsersIcon className="text-gray-400" size={32} />
                                            </div>
                                            <p className="text-lg font-semibold text-gray-600 mb-1">No applications yet</p>
                                            <p className="text-sm text-gray-400 max-w-md">Applications will appear here when candidates apply for your open vacancies.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Detail Modal */}
            {selectedApplication && (
                <Modal
                    isOpen={!!selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                    title={`Application: ${selectedApplication.firstName} ${selectedApplication.lastName}`}
                >
                    <div className="space-y-6">
                        {/* Applicant Info */}
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h3 className="font-bold text-gray-800 mb-4">Applicant Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <User className="text-kemu-purple" size={18} />
                                    <div>
                                        <p className="text-xs text-gray-500">Full Name</p>
                                        <p className="font-medium">{selectedApplication.firstName} {selectedApplication.lastName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="text-kemu-purple" size={18} />
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-medium">{selectedApplication.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="text-kemu-purple" size={18} />
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="font-medium">{selectedApplication.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-kemu-purple" size={18} />
                                    <div>
                                        <p className="text-xs text-gray-500">Applied On</p>
                                        <p className="font-medium">{formatDate(selectedApplication.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Position & Status */}
                        <div className="flex items-center justify-between p-4 bg-kemu-purple/5 rounded-xl">
                            <div>
                                <p className="text-xs text-gray-500">Applied for</p>
                                <p className="font-bold text-kemu-purple">{selectedApplication.vacancy?.title}</p>
                            </div>
                            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusColors[selectedApplication.status].bg} ${statusColors[selectedApplication.status].text}`}>
                                {statusColors[selectedApplication.status].label}
                            </span>
                        </div>

                        {/* Cover Letter */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-2">Cover Letter</h3>
                            <div className="bg-white border border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto">
                                <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                            </div>
                        </div>

                        {/* Documents */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-2">Documents</h3>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={`${UPLOADS_BASE_URL}${selectedApplication.cvPath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-kemu-purple text-white rounded-lg hover:bg-kemu-purple/90 transition-colors"
                                >
                                    <FileText size={18} />
                                    Download CV
                                </a>
                                {selectedApplication.documents && JSON.parse(selectedApplication.documents as unknown as string).map((doc: string, i: number) => (
                                    <a
                                        key={i}
                                        href={`${UPLOADS_BASE_URL}${doc}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <Download size={18} />
                                        Document {i + 1}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Update Status */}
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h3 className="font-bold text-gray-800 mb-4">Update Status</h3>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {(Object.keys(statusColors) as ApplicationStatus[]).map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        disabled={statusUpdating || selectedApplication.status === status}
                                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${selectedApplication.status === status
                                            ? `${statusColors[status].bg} ${statusColors[status].text} ring-2 ring-offset-2 ring-current`
                                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                                            } disabled:opacity-50`}
                                    >
                                        {statusColors[status].label}
                                    </button>
                                ))}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Notes</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add internal notes about this application..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, application: null })}
                title="Confirm Delete"
                onConfirm={handleDelete}
            >
                <p className="text-gray-700">
                    Are you sure you want to delete the application from{' '}
                    <strong>{deleteModal.application?.firstName} {deleteModal.application?.lastName}</strong>?
                    This action cannot be undone.
                </p>
            </Modal>
        </div>
    );
};

export default ApplicationsManagement;
