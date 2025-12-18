import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVacancyBySlug, submitApplication } from '../../services/api';
import { Vacancy } from '../../types';
import { handleApiError, formatDate } from '../../utils';
import { Briefcase, MapPin, Calendar, Clock, ArrowLeft, Upload, CheckCircle, AlertCircle, FileText, X, Sparkles } from 'lucide-react';

/**
 * TVET Apply Page - Dedicated application form for TVET vacancies
 * Keeps users within the TVET section without redirecting to main site
 */
const TVETApply: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    // Vacancy state
    const [vacancy, setVacancy] = useState<Vacancy | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        coverLetter: ''
    });
    const [cv, setCv] = useState<File | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Check if deadline has passed
    const isExpired = vacancy ? new Date(vacancy.deadline) < new Date() : false;

    useEffect(() => {
        const fetchVacancy = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                const data = await getVacancyBySlug(slug);
                setVacancy(data);
            } catch (err) {
                setError(handleApiError(err));
            } finally {
                setLoading(false);
            }
        };

        fetchVacancy();
    }, [slug]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validMimeTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/octet-stream'
            ];
            const validExtensions = ['.pdf', '.doc', '.docx'];
            const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

            const isValidType = validMimeTypes.includes(file.type) || validExtensions.includes(fileExtension);

            if (!isValidType) {
                setFormErrors(prev => ({ ...prev, cv: `Please upload a PDF or Word document.` }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setFormErrors(prev => ({ ...prev, cv: 'File size must be less than 5MB' }));
                return;
            }
            setCv(file);
            setFormErrors(prev => ({ ...prev, cv: '' }));
        }
    };

    const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + documents.length > 5) {
            setFormErrors(prev => ({ ...prev, documents: 'Maximum 5 supporting documents allowed' }));
            return;
        }
        setDocuments(prev => [...prev, ...files]);
        setFormErrors(prev => ({ ...prev, documents: '' }));
    };

    const removeDocument = (index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        if (!formData.coverLetter.trim()) errors.coverLetter = 'Cover letter is required';
        if (!cv) errors.cv = 'CV is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !vacancy) return;

        setSubmitting(true);
        setError(null);

        try {
            const data = new FormData();
            data.append('vacancyId', vacancy.id.toString());
            data.append('firstName', formData.firstName);
            data.append('lastName', formData.lastName);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('coverLetter', formData.coverLetter);
            data.append('cv', cv!);

            documents.forEach(doc => {
                data.append('documents', doc);
            });

            await submitApplication(data);
            setSuccess(true);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-kemu-purple/5 via-white to-kemu-gold/5">
                <div className="flex items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-kemu-purple border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (error && !vacancy) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-kemu-purple/5 via-white to-kemu-gold/5">
                <div className="container mx-auto px-4 py-16 text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Vacancy Not Found</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link to="/tvet/careers" className="text-kemu-purple hover:underline">
                        ← Back to TVET Careers
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-kemu-purple/5 via-white to-kemu-gold/5">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-green-50 rounded-2xl p-12 shadow-lg">
                            <CheckCircle className="mx-auto text-green-500 mb-6" size={64} />
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
                            <p className="text-gray-600 mb-6">
                                Thank you for applying for <strong>{vacancy?.title}</strong> at KeMU TVET Institute.
                                We have received your application and will review it shortly.
                            </p>
                            <p className="text-sm text-gray-500 mb-8">
                                A confirmation email has been sent to <strong>{formData.email}</strong>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/tvet/careers"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-kemu-purple text-white rounded-xl hover:bg-kemu-purple/90 transition-colors"
                                >
                                    Browse More TVET Jobs
                                </Link>
                                <Link
                                    to="/tvet"
                                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Return to TVET Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-kemu-purple/5 via-white to-kemu-gold/5">

            {/* Header */}
            <div className="bg-gradient-to-r from-kemu-purple via-kemu-purple to-kemu-blue text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-xs">
                            <Sparkles size={12} className="text-kemu-gold" />
                            <span>KeMU TVET Institute</span>
                        </div>
                    </div>
                    <Link to="/tvet/careers" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to TVET Careers
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Apply for Position</h1>
                    <p className="text-white/80">Complete the form below to submit your application to TVET Institute</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* Vacancy Details Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kemu-purple10 text-kemu-purple font-medium text-xs mb-4">
                                    <Sparkles size={12} />
                                    <span>TVET Position</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">{vacancy?.title}</h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <Briefcase size={16} className="mr-2 text-kemu-purple" />
                                        {vacancy?.department}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin size={16} className="mr-2 text-kemu-purple" />
                                        {vacancy?.location}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Clock size={16} className="mr-2 text-kemu-purple" />
                                        {vacancy?.type}
                                    </div>
                                    <div className={`flex items-center ${isExpired ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                        <Calendar size={16} className="mr-2 text-kemu-purple" />
                                        Deadline: {vacancy && formatDate(vacancy.deadline)}
                                    </div>
                                </div>

                                {isExpired && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-700 text-sm font-medium">
                                            This position is no longer accepting applications.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Application Form */}
                        <div className="lg:col-span-2">
                            {isExpired ? (
                                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Deadline Passed</h2>
                                    <p className="text-gray-600 mb-6">
                                        Unfortunately, the deadline for this position has passed and we are no longer accepting applications.
                                    </p>
                                    <Link to="/tvet/careers" className="text-kemu-purple hover:underline">
                                        View Other TVET Opportunities →
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                            <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                                            <p className="text-red-700">{error}</p>
                                        </div>
                                    )}

                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold transition-all ${formErrors.firstName ? 'border-red-300' : 'border-gray-200'}`}
                                                placeholder="John"
                                            />
                                            {formErrors.firstName && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold transition-all ${formErrors.lastName ? 'border-red-300' : 'border-gray-200'}`}
                                                placeholder="Doe"
                                            />
                                            {formErrors.lastName && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold transition-all ${formErrors.email ? 'border-red-300' : 'border-gray-200'}`}
                                                placeholder="john.doe@email.com"
                                            />
                                            {formErrors.email && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold transition-all ${formErrors.phone ? 'border-red-300' : 'border-gray-200'}`}
                                                placeholder="+254 700 000 000"
                                            />
                                            {formErrors.phone && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Cover Letter <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="coverLetter"
                                            value={formData.coverLetter}
                                            onChange={handleInputChange}
                                            rows={6}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold transition-all resize-none ${formErrors.coverLetter ? 'border-red-300' : 'border-gray-200'}`}
                                            placeholder="Tell us why you're the ideal candidate for this position..."
                                        />
                                        {formErrors.coverLetter && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.coverLetter}</p>
                                        )}
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">Documents</h2>

                                    {/* CV Upload */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            CV / Resume <span className="text-red-500">*</span>
                                        </label>
                                        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${formErrors.cv ? 'border-red-300 bg-red-50' : cv ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-kemu-purple'}`}>
                                            {cv ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <FileText className="text-green-600" size={24} />
                                                    <span className="text-gray-700 font-medium">{cv.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCv(null)}
                                                        className="p-1 text-gray-400 hover:text-red-500"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                                                    <p className="text-gray-600 mb-2">Upload your CV (PDF or Word)</p>
                                                    <p className="text-sm text-gray-400 mb-4">Max file size: 5MB</p>
                                                    <label className="inline-flex items-center px-4 py-2 bg-kemu-purple text-white rounded-lg cursor-pointer hover:bg-kemu-purple/90 transition-colors">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={handleCvChange}
                                                            className="hidden"
                                                        />
                                                        Select File
                                                    </label>
                                                </>
                                            )}
                                        </div>
                                        {formErrors.cv && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.cv}</p>
                                        )}
                                    </div>

                                    {/* Supporting Documents */}
                                    <div className="mb-8">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Supporting Documents <span className="text-gray-400">(Optional)</span>
                                        </label>
                                        <p className="text-sm text-gray-500 mb-3">
                                            Upload certificates, transcripts, or other relevant documents (max 5 files)
                                        </p>

                                        {documents.length > 0 && (
                                            <div className="mb-4 space-y-2">
                                                {documents.map((doc, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="text-gray-400" size={20} />
                                                            <span className="text-sm text-gray-700">{doc.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeDocument(index)}
                                                            className="p-1 text-gray-400 hover:text-red-500"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {documents.length < 5 && (
                                            <label className="inline-flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleDocumentsChange}
                                                    className="hidden"
                                                />
                                                <Upload size={18} className="mr-2" />
                                                Add Documents
                                            </label>
                                        )}
                                        {formErrors.documents && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.documents}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-4 bg-gradient-to-r from-kemu-gold to-kemu-gold/80 text-gray-900 font-bold rounded-xl hover:from-kemu-gold/90 hover:to-kemu-gold/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent"></div>
                                                Submitting Application...
                                            </>
                                        ) : (
                                            'Submit Application to TVET'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TVETApply;
