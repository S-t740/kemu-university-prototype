import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileSearch, AlertCircle, CheckCircle2, Clock, FileText, Sparkles, Loader2 } from 'lucide-react';
import { getStudentApplicationStatus } from '../services/api';

const statusInfo: Record<string, { label: string; color: string; description: string }> = {
    new: {
        label: 'New',
        color: 'bg-blue-100 text-blue-800',
        description: 'Your application has been received and is awaiting initial review.'
    },
    received: {
        label: 'Received',
        color: 'bg-purple-100 text-purple-800',
        description: 'Your application has been received and is in the queue for processing.'
    },
    reviewing: {
        label: 'Under Review',
        color: 'bg-amber-100 text-amber-800',
        description: 'Your application is currently being reviewed by our admissions team.'
    },
    shortlisted: {
        label: 'Shortlisted',
        color: 'bg-cyan-100 text-cyan-800',
        description: 'Congratulations! You have been shortlisted. Final decision pending.'
    },
    offered: {
        label: 'Offered',
        color: 'bg-green-100 text-green-800',
        description: 'Congratulations! You have been offered admission. Check your email for next steps.'
    },
    rejected: {
        label: 'Not Successful',
        color: 'bg-red-100 text-red-800',
        description: 'We regret to inform you that your application was not successful this time.'
    }
};

const ApplicationStatus: React.FC = () => {
    const [applicationId, setApplicationId] = useState('');
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [application, setApplication] = useState<any>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!applicationId.trim()) {
            setError('Please enter your application ID');
            return;
        }

        setSearching(true);
        setError(null);
        setApplication(null);

        try {
            const result = await getStudentApplicationStatus(applicationId.trim().toUpperCase());
            setApplication(result);
        } catch (err: any) {
            setError(err.message || 'Application not found. Please check your application ID and try again.');
        } finally {
            setSearching(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'offered':
                return <CheckCircle2 size={48} className="text-green-600" />;
            case 'rejected':
                return <AlertCircle size={48} className="text-red-600" />;
            case 'reviewing':
            case 'shortlisted':
                return <Clock size={48} className="text-amber-600" />;
            default:
                return <FileText size={48} className="text-blue-600" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-kemu-purple/5 to-white">
            {/* Header */}
            <section className="relative py-16 px-4 bg-gradient-to-br from-kemu-purple via-kemu-blue to-kemu-purple overflow-hidden">
                <div className="container mx-auto max-w-4xl relative z-10">
                    <div className="text-center text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-sm mb-4">
                            <Sparkles size={16} className="text-kemu-gold" />
                            <span>Application Portal</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Track Your Application</h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Enter your application ID to check the status of your admission application.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto max-w-2xl px-4 py-12">
                {/* Search Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <FileSearch size={16} className="inline mr-2 text-kemu-purple" />
                                Application ID
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={applicationId}
                                    onChange={(e) => setApplicationId(e.target.value.toUpperCase())}
                                    placeholder="e.g., KEMU-2024-00001"
                                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 
                    focus:border-kemu-purple focus:outline-none focus:ring-4 focus:ring-kemu-purple/20
                    text-lg font-medium tracking-wider"
                                />
                                <button
                                    type="submit"
                                    disabled={searching}
                                    className="px-6 py-3 bg-gradient-to-r from-kemu-purple to-kemu-gold text-white 
                    rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2
                    disabled:opacity-50"
                                >
                                    {searching ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Search size={20} />
                                    )}
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}

                    {application && (
                        <div className="mt-8 space-y-6 animate-fade-up">
                            {/* Status Card */}
                            <div className="text-center py-6 border-b border-gray-200">
                                {getStatusIcon(application.status)}
                                <div className="mt-4">
                                    <span className={`
                    inline-block px-4 py-2 rounded-full text-lg font-bold
                    ${statusInfo[application.status]?.color || 'bg-gray-100 text-gray-800'}
                  `}>
                                        {statusInfo[application.status]?.label || application.status}
                                    </span>
                                </div>
                                <p className="mt-4 text-gray-600 max-w-md mx-auto">
                                    {statusInfo[application.status]?.description}
                                </p>
                            </div>

                            {/* Application Details */}
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Application ID</span>
                                    <span className="font-bold text-kemu-purple">{application.applicationId}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Applicant Name</span>
                                    <span className="font-medium">{application.firstName} {application.lastName}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Programme</span>
                                    <span className="font-medium">{application.program?.title || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Payment Status</span>
                                    <span className={`font-medium ${application.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                                        {application.paymentStatus === 'paid' ? 'Paid' : application.paymentStatus === 'waived' ? 'Waived' : 'Pending'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Submitted On</span>
                                    <span className="font-medium">
                                        {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">Last Updated</span>
                                    <span className="font-medium">
                                        {application.updatedAt ? new Date(application.updatedAt).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* Help Text */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Need help?</strong> If you have any questions about your application,
                                    please contact our admissions office at{' '}
                                    <a href="mailto:admissions@kemu.ac.ke" className="underline">admissions@kemu.ac.ke</a>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Apply Link */}
                <div className="text-center mt-8">
                    <p className="text-gray-600 mb-4">Haven't applied yet?</p>
                    <Link
                        to="/student-apply"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-kemu-purple text-white 
              rounded-xl font-semibold hover:bg-kemu-purple/90 transition-colors"
                    >
                        Apply Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ApplicationStatus;
