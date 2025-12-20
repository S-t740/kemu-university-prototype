import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    LogOut, Plus, FileSearch, Clock, CheckCircle2, XCircle, Loader2,
    GraduationCap, AlertCircle, Mail, Phone, Calendar, Sparkles, RefreshCw,
    Link as LinkIcon
} from 'lucide-react';
import { useApplicantAuth } from '../contexts/ApplicantAuthContext';
import { getApplicantApplications, linkApplicationToAccount } from '../services/api';
import { StudentApplication } from '../types';

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    new: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Clock size={16} /> },
    received: { bg: 'bg-purple-100', text: 'text-purple-800', icon: <Clock size={16} /> },
    reviewing: { bg: 'bg-amber-100', text: 'text-amber-800', icon: <Clock size={16} /> },
    shortlisted: { bg: 'bg-cyan-100', text: 'text-cyan-800', icon: <CheckCircle2 size={16} /> },
    offered: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle2 size={16} /> },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle size={16} /> }
};

const ApplicantDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { applicant, logout, isAuthenticated, isLoading: authLoading } = useApplicantAuth();

    const [applications, setApplications] = useState<StudentApplication[]>([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, offered: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Link application modal
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkApplicationId, setLinkApplicationId] = useState('');
    const [linkNationalId, setLinkNationalId] = useState('');
    const [linkLoading, setLinkLoading] = useState(false);
    const [linkError, setLinkError] = useState('');

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/applicant/login', { replace: true });
        }
    }, [authLoading, isAuthenticated, navigate]);

    const fetchApplications = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getApplicantApplications();
            setApplications(response.applications);
            setStats(response.stats);
        } catch (err: any) {
            setError(err.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchApplications();
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        navigate('/applicant/login');
    };

    const handleLinkApplication = async () => {
        if (!linkApplicationId.trim()) {
            setLinkError('Please enter an application ID');
            return;
        }
        setLinkLoading(true);
        setLinkError('');
        try {
            await linkApplicationToAccount(linkApplicationId, linkNationalId || undefined);
            setShowLinkModal(false);
            setLinkApplicationId('');
            setLinkNationalId('');
            fetchApplications();
        } catch (err: any) {
            setLinkError(err.message || 'Failed to link application');
        } finally {
            setLinkLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 size={32} className="animate-spin text-kemu-purple" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-kemu-purple/5 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-kemu-purple via-kemu-blue to-kemu-purple py-8 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-xl font-bold">
                                {applicant?.firstName?.[0]}{applicant?.lastName?.[0]}
                            </div>
                            <div className="text-white">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-kemu-gold" />
                                    <span className="text-sm text-white/80">Applicant Dashboard</span>
                                </div>
                                <h1 className="text-2xl font-serif font-bold">
                                    Welcome, {applicant?.firstName}!
                                </h1>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 
                text-white rounded-xl transition-colors"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-kemu-purple">
                        <p className="text-gray-500 text-sm">Total Applications</p>
                        <p className="text-3xl font-bold text-kemu-purple">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-amber-500">
                        <p className="text-gray-500 text-sm">Pending</p>
                        <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500">
                        <p className="text-gray-500 text-sm">Offered</p>
                        <p className="text-3xl font-bold text-green-600">{stats.offered}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-red-500">
                        <p className="text-gray-500 text-sm">Not Successful</p>
                        <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <Link
                        to="/student-apply"
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-kemu-purple to-kemu-gold 
              text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
                    >
                        <Plus size={20} />
                        New Application
                    </Link>
                    <button
                        onClick={() => setShowLinkModal(true)}
                        className="flex items-center gap-2 px-6 py-3 border-2 border-kemu-purple 
              text-kemu-purple rounded-xl font-semibold hover:bg-kemu-purple/5 transition-colors"
                    >
                        <LinkIcon size={20} />
                        Link Existing Application
                    </button>
                    <button
                        onClick={fetchApplications}
                        className="flex items-center gap-2 px-4 py-3 border-2 border-gray-200 
              text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                        <span className="text-red-800">{error}</span>
                    </div>
                )}

                {/* Applications List */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Your Applications</h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 size={32} className="animate-spin text-kemu-purple" />
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <FileSearch size={64} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Applications Yet</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Start your journey at KeMU by submitting your first application.
                            </p>
                            <Link
                                to="/student-apply"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-kemu-purple text-white 
                  rounded-xl font-semibold hover:bg-kemu-purple/90 transition-colors"
                            >
                                <Plus size={20} />
                                Apply Now
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {applications.map((app) => (
                                <div
                                    key={app.id}
                                    className="p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between flex-wrap gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-mono font-bold text-kemu-purple">{app.applicationId}</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                          ${statusColors[app.status]?.bg} ${statusColors[app.status]?.text}`}
                                                >
                                                    {statusColors[app.status]?.icon}
                                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                {app.program?.title || 'Unknown Programme'}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <GraduationCap size={14} />
                                                    {app.program?.degreeType}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {app.intake} Intake
                                                </span>
                                                <span>
                                                    Applied: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/application-status?id=${app.applicationId}`}
                                            className="px-4 py-2 border border-kemu-purple text-kemu-purple rounded-lg 
                        hover:bg-kemu-purple hover:text-white transition-colors text-sm font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Profile Info */}
                <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-gray-400" />
                            <span className="text-gray-600">{applicant?.email}</span>
                        </div>
                        {applicant?.phone && (
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-gray-400" />
                                <span className="text-gray-600">{applicant.phoneCode} {applicant.phone}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Link Application Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-up">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Link Existing Application</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            If you submitted an application before creating an account, you can link it here.
                        </p>

                        {linkError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                                <AlertCircle size={16} className="text-red-600" />
                                <span className="text-red-800 text-sm">{linkError}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Application ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={linkApplicationId}
                                    onChange={(e) => setLinkApplicationId(e.target.value.toUpperCase())}
                                    placeholder="e.g., KEMU-2024-00001"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                    focus:border-kemu-purple focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    National ID <span className="text-gray-400 font-normal">(if email differs)</span>
                                </label>
                                <input
                                    type="text"
                                    value={linkNationalId}
                                    onChange={(e) => setLinkNationalId(e.target.value)}
                                    placeholder="Used for verification"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                    focus:border-kemu-purple focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowLinkModal(false)}
                                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLinkApplication}
                                disabled={linkLoading}
                                className="flex-1 py-3 bg-kemu-purple text-white rounded-xl font-medium 
                  hover:bg-kemu-purple/90 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {linkLoading ? <Loader2 size={18} className="animate-spin" /> : <LinkIcon size={18} />}
                                Link Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantDashboard;
