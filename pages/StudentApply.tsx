import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loader2, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { ApplicationWizard } from '../components/apply';
import { useApplicantAuth } from '../contexts/ApplicantAuthContext';

interface StudentApplyProps {
    institution?: 'KEMU' | 'TVET';
}

const StudentApply: React.FC<StudentApplyProps> = ({ institution = 'KEMU' }) => {
    const location = useLocation();
    const { isAuthenticated, isLoading, applicant } = useApplicantAuth();

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-kemu-purple/5 to-white">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-kemu-purple mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Show login/register prompt if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-kemu-purple/5 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-kemu-purple via-kemu-blue to-kemu-purple py-12 px-4">
                    <div className="container mx-auto max-w-2xl text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-sm mb-4">
                            <Sparkles size={16} className="text-kemu-gold" />
                            <span>{institution === 'TVET' ? 'TVET Institute' : 'Kenya Methodist University'}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                            Student Application Portal
                        </h1>
                        <p className="text-white/80">Apply online for admission</p>
                    </div>
                </div>

                {/* Login Required Message */}
                <div className="container mx-auto max-w-lg px-4 py-12">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-kemu-purple/10 flex items-center justify-center mx-auto mb-6">
                            <LogIn size={36} className="text-kemu-purple" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            Sign In to Continue
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Please log in to your applicant account or create a new one to start your application.
                            This allows you to save your progress and track your application status.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/applicant/login"
                                state={{ from: location.pathname }}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 
                                    bg-gradient-to-r from-kemu-purple to-kemu-gold text-white 
                                    rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
                            >
                                <LogIn size={20} />
                                Sign In
                            </Link>
                            <Link
                                to="/applicant/register"
                                state={{ from: location.pathname }}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 
                                    border-2 border-kemu-purple text-kemu-purple 
                                    rounded-xl font-semibold hover:bg-kemu-purple/5 transition-colors"
                            >
                                <UserPlus size={20} />
                                Create Account
                            </Link>
                        </div>

                        <div className="mt-8 pt-6 border-t">
                            <p className="text-sm text-gray-500">
                                Already applied without an account?{' '}
                                <Link to="/application-status" className="text-kemu-purple font-medium hover:underline">
                                    Track your status here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <ApplicationWizard institution={institution} applicant={applicant} />;
};

export default StudentApply;
