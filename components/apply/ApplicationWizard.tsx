import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, Send, Sparkles } from 'lucide-react';
import { StudentApplicationFormData, Program, EducationEntry, PhoneCountry, StudentApplication } from '../../types';
import { getPrograms, submitStudentApplication } from '../../services/api';
import WizardProgress from './WizardProgress';
import ApplicantProfile from './ApplicantProfile';
import ProgrammeSelection from './ProgrammeSelection';
import EducationBackground from './EducationBackground';
import DocumentUpload from './DocumentUpload';
import PaymentSection from './PaymentSection';
import ReviewDeclaration from './ReviewDeclaration';
import ApplicationConfirmation from './ApplicationConfirmation';

interface ApplicationWizardProps {
    institution?: 'KEMU' | 'TVET';
    applicant?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
        phoneCode?: string;
        nationalId?: string;
    } | null;
}

const STORAGE_KEY = 'kemu_application_draft';

// Common phone country codes
const phoneCountries: PhoneCountry[] = [
    { code: 'KE', name: 'Kenya', dial_code: '+254', flag: '🇰🇪' },
    { code: 'UG', name: 'Uganda', dial_code: '+256', flag: '🇺🇬' },
    { code: 'TZ', name: 'Tanzania', dial_code: '+255', flag: '🇹🇿' },
    { code: 'RW', name: 'Rwanda', dial_code: '+250', flag: '🇷🇼' },
    { code: 'ET', name: 'Ethiopia', dial_code: '+251', flag: '🇪🇹' },
    { code: 'SS', name: 'South Sudan', dial_code: '+211', flag: '🇸🇸' },
    { code: 'SO', name: 'Somalia', dial_code: '+252', flag: '🇸🇴' },
    { code: 'CD', name: 'DR Congo', dial_code: '+243', flag: '🇨🇩' },
    { code: 'NG', name: 'Nigeria', dial_code: '+234', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', dial_code: '+233', flag: '🇬🇭' },
    { code: 'ZA', name: 'South Africa', dial_code: '+27', flag: '🇿🇦' },
    { code: 'US', name: 'United States', dial_code: '+1', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', dial_code: '+44', flag: '🇬🇧' },
    { code: 'IN', name: 'India', dial_code: '+91', flag: '🇮🇳' },
    { code: 'CN', name: 'China', dial_code: '+86', flag: '🇨🇳' },
    { code: 'AE', name: 'UAE', dial_code: '+971', flag: '🇦🇪' },
    { code: 'DE', name: 'Germany', dial_code: '+49', flag: '🇩🇪' },
    { code: 'FR', name: 'France', dial_code: '+33', flag: '🇫🇷' },
    { code: 'AU', name: 'Australia', dial_code: '+61', flag: '🇦🇺' },
    { code: 'CA', name: 'Canada', dial_code: '+1', flag: '🇨🇦' }
];

const steps = [
    { label: 'Profile', description: 'Personal information' },
    { label: 'Programme', description: 'Course selection' },
    { label: 'Education', description: 'Academic background' },
    { label: 'Documents', description: 'Upload files' },
    { label: 'Payment', description: 'Application fee' },
    { label: 'Review', description: 'Confirm details' },
    { label: 'Complete', description: 'Submission' }
];

const initialFormData: StudentApplicationFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '+254',
    phone: '',
    nationalId: '',
    dateOfBirth: '',
    nationality: 'Kenyan',
    physicalAddress: '',
    programId: null,
    intake: '',
    applicationType: '',
    kuccpsRefNumber: '',
    sponsorDetails: '',
    educationHistory: [{ id: '1', level: '', institution: '', award: '', year: '', grade: '' }],
    passportPhoto: '',
    nationalIdDoc: '',
    academicCerts: [],
    supportingDocs: [],
    paymentMethod: '',
    paymentReference: '',
    mpesaReceiptNumber: '',
    declarationAccepted: false,
    privacyConsent: false,
    institution: 'KEMU'
};

const ApplicationWizard: React.FC<ApplicationWizardProps> = ({ institution = 'KEMU', applicant }) => {
    const { programmeSlug } = useParams<{ programmeSlug?: string }>();
    const navigate = useNavigate();

    // Initialize form with applicant data if available
    const getInitialFormData = (): StudentApplicationFormData => {
        const base = { ...initialFormData, institution };
        if (applicant) {
            return {
                ...base,
                firstName: applicant.firstName || '',
                lastName: applicant.lastName || '',
                email: applicant.email || '',
                phone: applicant.phone || '',
                phoneCode: applicant.phoneCode || '+254',
                nationalId: applicant.nationalId || ''
            };
        }
        return base;
    };

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<StudentApplicationFormData>(getInitialFormData());
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loadingPrograms, setLoadingPrograms] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submittedApplication, setSubmittedApplication] = useState<StudentApplication | null>(null);
    const [submittedApplicationId, setSubmittedApplicationId] = useState<string>('');

    // Load saved draft from localStorage
    useEffect(() => {
        const savedDraft = localStorage.getItem(STORAGE_KEY);
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                if (parsed.institution === institution) {
                    setFormData(parsed);
                }
            } catch (e) {
                console.error('Failed to parse saved draft');
            }
        }
    }, [institution]);

    // Autosave to localStorage
    useEffect(() => {
        if (currentStep < 7) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData, currentStep]);

    // Fetch programs
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                setLoadingPrograms(true);
                const data = await getPrograms(undefined, undefined, institution === 'TVET' ? 'TVET' : undefined);
                setPrograms(data);

                // Pre-select program if slug provided
                if (programmeSlug) {
                    const program = data.find(p => p.slug === programmeSlug);
                    if (program) {
                        setFormData(prev => ({ ...prev, programId: program.id }));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch programs:', error);
            } finally {
                setLoadingPrograms(false);
            }
        };
        fetchPrograms();
    }, [institution, programmeSlug]);

    const updateFormData = (data: Partial<StudentApplicationFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
        // Clear errors for updated fields
        const clearedErrors = { ...errors };
        Object.keys(data).forEach(key => delete clearedErrors[key]);
        setErrors(clearedErrors);
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 1:
                if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
                if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
                if (!formData.email.trim()) newErrors.email = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
                if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
                if (!formData.nationalId.trim()) newErrors.nationalId = 'National ID is required';
                if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
                if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
                if (!formData.physicalAddress.trim()) newErrors.physicalAddress = 'Address is required';
                break;

            case 2:
                if (!formData.programId) newErrors.programId = 'Please select a programme';
                if (!formData.intake) newErrors.intake = 'Please select an intake';
                if (!formData.applicationType) newErrors.applicationType = 'Please select application type';
                if (formData.applicationType === 'KUCCPS' && !formData.kuccpsRefNumber?.trim()) {
                    newErrors.kuccpsRefNumber = 'KUCCPS reference number is required';
                }
                if (formData.applicationType === 'Sponsored' && !formData.sponsorDetails?.trim()) {
                    newErrors.sponsorDetails = 'Sponsor details are required';
                }
                break;

            case 3:
                const hasValidEducation = formData.educationHistory.some(
                    e => e.level && e.institution && e.award && e.year && e.grade
                );
                if (!hasValidEducation) {
                    newErrors.educationHistory = 'Please add at least one complete education entry';
                }
                break;

            case 4:
                if (!formData.passportPhoto) newErrors.passportPhoto = 'Passport photo is required';
                if (!formData.nationalIdDoc) newErrors.nationalIdDoc = 'National ID document is required';
                if (!formData.academicCerts?.length) newErrors.academicCerts = 'At least one academic certificate is required';
                break;

            case 5:
                // Payment is optional for now - can be waived by admin
                break;

            case 6:
                if (!formData.declarationAccepted) newErrors.declarationAccepted = 'You must accept the declaration';
                if (!formData.privacyConsent) newErrors.privacyConsent = 'You must consent to privacy policy';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 7));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToStep = (step: number) => {
        if (step < currentStep) {
            setCurrentStep(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(6)) return;

        setSubmitting(true);
        setErrors({});

        try {
            const result = await submitStudentApplication(formData);

            if (result.success) {
                setSubmittedApplicationId(result.applicationId);
                setSubmittedApplication(result.application);
                localStorage.removeItem(STORAGE_KEY); // Clear draft
                setCurrentStep(7);
            }
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to submit application. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <ApplicantProfile
                        formData={formData}
                        updateFormData={updateFormData}
                        errors={errors}
                        phoneCountries={phoneCountries}
                    />
                );
            case 2:
                return (
                    <ProgrammeSelection
                        formData={formData}
                        updateFormData={updateFormData}
                        errors={errors}
                        programs={programs}
                        loadingPrograms={loadingPrograms}
                    />
                );
            case 3:
                return (
                    <EducationBackground
                        formData={formData}
                        updateFormData={updateFormData}
                        errors={errors}
                    />
                );
            case 4:
                return (
                    <DocumentUpload
                        formData={formData}
                        updateFormData={updateFormData}
                        errors={errors}
                    />
                );
            case 5:
                return (
                    <PaymentSection
                        formData={formData}
                        updateFormData={updateFormData}
                        errors={errors}
                        applicationId={submittedApplicationId || 'PENDING'}
                    />
                );
            case 6:
                return (
                    <ReviewDeclaration
                        formData={formData}
                        updateFormData={updateFormData}
                        errors={errors}
                        goToStep={goToStep}
                        programs={programs}
                    />
                );
            case 7:
                return (
                    <ApplicationConfirmation
                        application={submittedApplication}
                        applicationId={submittedApplicationId}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-kemu-purple/5 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-kemu-purple via-kemu-blue to-kemu-purple py-8 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-sm mb-4">
                        <Sparkles size={16} className="text-kemu-gold" />
                        <span>{institution === 'TVET' ? 'TVET Institute' : 'Kenya Methodist University'}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                        Student Application Portal
                    </h1>
                    <p className="text-white/80 mt-2">Apply online for admission</p>
                </div>
            </div>

            {/* Progress Bar */}
            {currentStep < 7 && (
                <div className="container mx-auto max-w-4xl">
                    <WizardProgress currentStep={currentStep} steps={steps} />
                </div>
            )}

            {/* Form Content */}
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
                    {renderStep()}

                    {/* Navigation Buttons */}
                    {currentStep < 7 && (
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-between">
                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 
                    text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                    Previous
                                </button>
                            ) : (
                                <div /> // Spacer
                            )}

                            {currentStep < 6 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center justify-center gap-2 px-8 py-3 
                    bg-gradient-to-r from-kemu-purple to-kemu-gold text-white 
                    rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
                                >
                                    Next Step
                                    <ArrowRight size={20} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex items-center justify-center gap-2 px-8 py-3 
                    bg-gradient-to-r from-green-600 to-green-500 text-white 
                    rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg
                    disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Submit Application
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationWizard;
