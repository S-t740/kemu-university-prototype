import React, { useState, useEffect } from 'react';
import {
    Search, Filter, RefreshCw, Eye, Trash2, MoreVertical, ChevronLeft, ChevronRight,
    FileText, CheckCircle, XCircle, Clock, UserCheck, Mail, Download, AlertCircle,
    GraduationCap, Phone, Calendar, MapPin, DollarSign, FileSearch, Edit2, Send
} from 'lucide-react';
import {
    StudentApplication,
    StudentApplicationStatus,
    StudentApplicationStats,
    Program,
    EducationEntry
} from '../types';
import {
    getStudentApplications,
    getStudentApplicationStats,
    getStudentApplicationDetail,
    updateStudentApplicationStatus,
    addStudentApplicationNotes,
    updateStudentApplicationPayment,
    deleteStudentApplication,
    getPrograms
} from '../services/api';
import Modal from './Modal';

interface StudentApplicationsManagementProps {
    institution?: 'KEMU' | 'TVET';
}

const statusColors: Record<StudentApplicationStatus, { bg: string; text: string; label: string }> = {
    new: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'New' },
    received: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Received' },
    reviewing: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Reviewing' },
    shortlisted: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'Shortlisted' },
    offered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Offered' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
};

const paymentStatusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-800' },
    paid: { bg: 'bg-green-100', text: 'text-green-800' },
    waived: { bg: 'bg-blue-100', text: 'text-blue-800' }
};

const StudentApplicationsManagement: React.FC<StudentApplicationsManagementProps> = ({ institution }) => {
    const [applications, setApplications] = useState<StudentApplication[]>([]);
    const [stats, setStats] = useState<StudentApplicationStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [programs, setPrograms] = useState<Program[]>([]);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [intakeFilter, setIntakeFilter] = useState('');
    const [programFilter, setProgramFilter] = useState<number | ''>('');

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 15;

    // Modal states
    const [selectedApplication, setSelectedApplication] = useState<StudentApplication | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState<StudentApplicationStatus>('new');
    const [adminNotes, setAdminNotes] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch applications
    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getStudentApplications({
                institution,
                status: statusFilter || undefined,
                intake: intakeFilter || undefined,
                programId: programFilter || undefined,
                search: searchQuery || undefined,
                page,
                limit
            });
            setApplications(result.applications);
            setTotalPages(result.pagination.totalPages);
            setTotal(result.pagination.total);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats
    const fetchStats = async () => {
        try {
            const result = await getStudentApplicationStats(institution);
            setStats(result);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    // Fetch programs for filter
    const fetchPrograms = async () => {
        try {
            const result = await getPrograms(undefined, undefined, institution === 'TVET' ? 'TVET' : undefined);
            setPrograms(result);
        } catch (err) {
            console.error('Failed to fetch programs:', err);
        }
    };

    useEffect(() => {
        fetchPrograms();
        fetchStats();
    }, [institution]);

    useEffect(() => {
        fetchApplications();
    }, [page, statusFilter, intakeFilter, programFilter, institution]);

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchApplications();
    };

    // View application detail
    const handleViewDetail = async (app: StudentApplication) => {
        try {
            const detail = await getStudentApplicationDetail(app.id);
            setSelectedApplication(detail);
            setShowDetailModal(true);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch application details');
        }
    };

    // Update status
    const handleUpdateStatus = async () => {
        if (!selectedApplication) return;
        setActionLoading(true);
        try {
            await updateStudentApplicationStatus(selectedApplication.id, newStatus, adminNotes);
            setShowStatusModal(false);
            setShowDetailModal(false);
            fetchApplications();
            fetchStats();
        } catch (err: any) {
            setError(err.message || 'Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    // Delete application
    const handleDelete = async () => {
        if (!selectedApplication) return;
        setActionLoading(true);
        try {
            await deleteStudentApplication(selectedApplication.id);
            setShowDeleteModal(false);
            setShowDetailModal(false);
            fetchApplications();
            fetchStats();
        } catch (err: any) {
            setError(err.message || 'Failed to delete application');
        } finally {
            setActionLoading(false);
        }
    };

    // Parse education history
    const parseEducation = (edu: string | EducationEntry[]): EducationEntry[] => {
        if (Array.isArray(edu)) return edu;
        try {
            return JSON.parse(edu);
        } catch {
            return [];
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-kemu-purple">
                        <p className="text-gray-500 text-sm">Total Applications</p>
                        <p className="text-2xl font-bold text-kemu-purple">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
                        <p className="text-gray-500 text-sm">This Week</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.recentWeek}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                        <p className="text-gray-500 text-sm">Offered</p>
                        <p className="text-2xl font-bold text-green-600">{stats.byStatus?.offered || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-amber-500">
                        <p className="text-gray-500 text-sm">Pending Review</p>
                        <p className="text-2xl font-bold text-amber-600">
                            {(stats.byStatus?.new || 0) + (stats.byStatus?.received || 0) + (stats.byStatus?.reviewing || 0)}
                        </p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, email, or ID..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kemu-purple/30"
                            />
                        </div>
                    </form>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kemu-purple/30"
                    >
                        <option value="">All Status</option>
                        {Object.entries(statusColors).map(([key, val]) => (
                            <option key={key} value={key}>{val.label}</option>
                        ))}
                    </select>

                    {/* Intake Filter */}
                    <select
                        value={intakeFilter}
                        onChange={(e) => { setIntakeFilter(e.target.value); setPage(1); }}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kemu-purple/30"
                    >
                        <option value="">All Intakes</option>
                        <option value="January">January</option>
                        <option value="May">May</option>
                        <option value="September">September</option>
                    </select>

                    {/* Program Filter */}
                    <select
                        value={programFilter}
                        onChange={(e) => { setProgramFilter(e.target.value ? parseInt(e.target.value) : ''); setPage(1); }}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kemu-purple/30 max-w-[200px]"
                    >
                        <option value="">All Programs</option>
                        {programs.map((p) => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>

                    {/* Refresh */}
                    <button
                        onClick={() => { fetchApplications(); fetchStats(); }}
                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="text-red-600" size={20} />
                    <span className="text-red-800">{error}</span>
                </div>
            )}

            {/* Applications Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-kemu-purple border-t-transparent" />
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-16">
                        <FileSearch size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No applications found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Application ID</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Applicant</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Programme</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Intake</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="font-mono font-bold text-kemu-purple text-sm">{app.applicationId}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-gray-800">{app.firstName} {app.lastName}</p>
                                                    <p className="text-xs text-gray-500">{app.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-700 max-w-[200px] truncate">{app.program?.title || 'N/A'}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-700">{app.intake}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]?.bg} ${statusColors[app.status]?.text}`}>
                                                    {statusColors[app.status]?.label || app.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColors[app.paymentStatus]?.bg} ${paymentStatusColors[app.paymentStatus]?.text}`}>
                                                    {app.paymentStatus.charAt(0).toUpperCase() + app.paymentStatus.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-500">
                                                    {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetail(app)}
                                                        className="p-2 text-kemu-purple hover:bg-kemu-purple/10 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedApplication(app); setShowDeleteModal(true); }}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-4 py-3 border-t">
                            <p className="text-sm text-gray-500">
                                Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="px-4 py-2 text-sm font-medium">{page} / {totalPages}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedApplication && (
                <Modal
                    isOpen={showDetailModal}
                    onClose={() => { setShowDetailModal(false); setSelectedApplication(null); }}
                    title={`Application: ${selectedApplication.applicationId}`}
                >
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                        {/* Status & Actions */}
                        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b">
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[selectedApplication.status]?.bg} ${statusColors[selectedApplication.status]?.text}`}>
                                    {statusColors[selectedApplication.status]?.label}
                                </span>
                                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${paymentStatusColors[selectedApplication.paymentStatus]?.bg} ${paymentStatusColors[selectedApplication.paymentStatus]?.text}`}>
                                    Payment: {selectedApplication.paymentStatus}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setNewStatus(selectedApplication.status);
                                        setAdminNotes(selectedApplication.adminNotes || '');
                                        setShowStatusModal(true);
                                    }}
                                    className="px-4 py-2 bg-kemu-purple text-white rounded-lg flex items-center gap-2 hover:bg-kemu-purple/90"
                                >
                                    <Edit2 size={16} />
                                    Update Status
                                </button>
                            </div>
                        </div>

                        {/* Applicant Info */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <UserCheck size={18} className="text-kemu-purple" />
                                    Applicant Profile
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedApplication.firstName} {selectedApplication.lastName}</span></p>
                                    <p><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedApplication.email}</span></p>
                                    <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedApplication.phoneCode} {selectedApplication.phone}</span></p>
                                    <p><span className="text-gray-500">National ID:</span> <span className="font-medium">{selectedApplication.nationalId}</span></p>
                                    <p><span className="text-gray-500">DOB:</span> <span className="font-medium">{new Date(selectedApplication.dateOfBirth).toLocaleDateString()}</span></p>
                                    <p><span className="text-gray-500">Nationality:</span> <span className="font-medium">{selectedApplication.nationality}</span></p>
                                    <p><span className="text-gray-500">Address:</span> <span className="font-medium">{selectedApplication.physicalAddress}</span></p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <GraduationCap size={18} className="text-kemu-purple" />
                                    Programme Selection
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-500">Programme:</span> <span className="font-medium">{selectedApplication.program?.title}</span></p>
                                    <p><span className="text-gray-500">Degree Type:</span> <span className="font-medium">{selectedApplication.program?.degreeType}</span></p>
                                    <p><span className="text-gray-500">Intake:</span> <span className="font-medium">{selectedApplication.intake}</span></p>
                                    <p><span className="text-gray-500">Application Type:</span> <span className="font-medium">{selectedApplication.applicationType}</span></p>
                                    {selectedApplication.kuccpsRefNumber && (
                                        <p><span className="text-gray-500">KUCCPS Ref:</span> <span className="font-medium">{selectedApplication.kuccpsRefNumber}</span></p>
                                    )}
                                    {selectedApplication.sponsorDetails && (
                                        <p><span className="text-gray-500">Sponsor:</span> <span className="font-medium">{selectedApplication.sponsorDetails}</span></p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Education History */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <GraduationCap size={18} className="text-kemu-purple" />
                                Education Background
                            </h4>
                            <div className="space-y-3">
                                {parseEducation(selectedApplication.educationHistory).map((edu, index) => (
                                    <div key={index} className="bg-white rounded-lg p-3 border">
                                        <p className="font-medium text-gray-800">{edu.level} - {edu.award}</p>
                                        <p className="text-sm text-gray-600">{edu.institution} • {edu.year} • Grade: {edu.grade}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <FileText size={18} className="text-kemu-purple" />
                                Uploaded Documents
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3">
                                {selectedApplication.passportPhoto && (
                                    <a href={selectedApplication.passportPhoto} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:border-kemu-purple transition-colors">
                                        <Download size={16} className="text-kemu-purple" />
                                        <span className="text-sm">Passport Photo</span>
                                    </a>
                                )}
                                {selectedApplication.nationalIdDoc && (
                                    <a href={selectedApplication.nationalIdDoc} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:border-kemu-purple transition-colors">
                                        <Download size={16} className="text-kemu-purple" />
                                        <span className="text-sm">National ID</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Admin Notes */}
                        {selectedApplication.adminNotes && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <h4 className="font-bold text-amber-800 mb-2">Admin Notes</h4>
                                <p className="text-sm text-amber-700 whitespace-pre-wrap">{selectedApplication.adminNotes}</p>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* Status Update Modal */}
            {showStatusModal && selectedApplication && (
                <Modal
                    isOpen={showStatusModal}
                    onClose={() => setShowStatusModal(false)}
                    title="Update Application Status"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">New Status</label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value as StudentApplicationStatus)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kemu-purple/30"
                            >
                                {Object.entries(statusColors).map(([key, val]) => (
                                    <option key={key} value={key}>{val.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Notes</label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kemu-purple/30"
                                rows={4}
                                placeholder="Add notes about this status change..."
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={actionLoading}
                                className="flex-1 py-2 bg-kemu-purple text-white rounded-lg hover:bg-kemu-purple/90 disabled:opacity-50"
                            >
                                {actionLoading ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedApplication && (
                <Modal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Application"
                >
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Are you sure you want to delete application <strong>{selectedApplication.applicationId}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={actionLoading}
                                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                            >
                                {actionLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default StudentApplicationsManagement;
