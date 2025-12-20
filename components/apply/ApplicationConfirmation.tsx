import React from 'react';
import { CheckCircle2, Mail, MessageCircle, FileSearch, ArrowRight, Download, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StudentApplication } from '../../types';

interface ApplicationConfirmationProps {
    application: StudentApplication | null;
    applicationId: string;
}

const ApplicationConfirmation: React.FC<ApplicationConfirmationProps> = ({
    application,
    applicationId
}) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(applicationId);
    };

    return (
        <div className="text-center space-y-8 py-8">
            {/* Success Icon Animation */}
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <div className="relative bg-gradient-to-br from-green-500 to-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 size={48} className="text-white" />
                </div>
            </div>

            {/* Success Message */}
            <div>
                <h2 className="text-3xl font-serif font-bold text-gray-800">Application Submitted!</h2>
                <p className="text-gray-500 mt-3 max-w-md mx-auto">
                    Congratulations! Your application has been successfully submitted to Kenya Methodist University.
                </p>
            </div>

            {/* Application ID Card */}
            <div className="bg-gradient-to-br from-kemu-purple to-kemu-gold p-[2px] rounded-2xl max-w-md mx-auto">
                <div className="bg-white rounded-2xl p-6">
                    <p className="text-sm text-gray-500 mb-2">Your Application ID</p>
                    <div className="flex items-center justify-center gap-3">
                        <p className="text-2xl font-bold text-kemu-purple tracking-wider">{applicationId}</p>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 text-gray-400 hover:text-kemu-purple hover:bg-kemu-purple/10 rounded-lg transition-colors"
                            title="Copy to clipboard"
                        >
                            <Share2 size={20} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Keep this ID safe for tracking your application</p>
                </div>
            </div>

            {/* What's Next */}
            <div className="bg-gray-50 rounded-2xl p-6 max-w-lg mx-auto text-left">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ArrowRight size={18} className="text-kemu-purple" />
                    What happens next?
                </h3>
                <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-kemu-purple text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                        <div>
                            <p className="font-medium text-gray-800">Application Review</p>
                            <p className="text-sm text-gray-500">Our admissions team will review your application within 5-7 working days.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-kemu-purple text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                        <div>
                            <p className="font-medium text-gray-800">Document Verification</p>
                            <p className="text-sm text-gray-500">Your uploaded documents will be verified for authenticity.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-kemu-purple text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                        <div>
                            <p className="font-medium text-gray-800">Admission Decision</p>
                            <p className="text-sm text-gray-500">You will receive an email notification with the admission decision.</p>
                        </div>
                    </li>
                </ol>
            </div>

            {/* Notifications */}
            <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <Mail size={24} className="text-blue-600 flex-shrink-0" />
                    <div className="text-left">
                        <p className="font-medium text-blue-800">Email Confirmation</p>
                        <p className="text-sm text-blue-600">A confirmation email has been sent to {application?.email || 'your email'}.</p>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <MessageCircle size={24} className="text-green-600 flex-shrink-0" />
                    <div className="text-left">
                        <p className="font-medium text-green-800">SMS Updates</p>
                        <p className="text-sm text-green-600">You will receive SMS updates on your application status.</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <Link
                    to="/application-status"
                    className="flex-1 py-3 px-6 bg-kemu-purple text-white rounded-xl font-semibold
            hover:bg-kemu-purple/90 transition-colors flex items-center justify-center gap-2"
                >
                    <FileSearch size={20} />
                    Track Application
                </Link>
                <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold
            hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                    <Download size={20} />
                    Print Confirmation
                </button>
            </div>

            {/* Return Home */}
            <div>
                <Link
                    to="/"
                    className="text-kemu-purple hover:text-kemu-gold transition-colors font-medium"
                >
                    ← Return to Home
                </Link>
            </div>
        </div>
    );
};

export default ApplicationConfirmation;
