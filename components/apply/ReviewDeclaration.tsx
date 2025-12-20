import React from 'react';
import { User, GraduationCap, FileText, CreditCard, CheckCircle2, AlertTriangle, Edit2 } from 'lucide-react';
import { StudentApplicationFormData, Program } from '../../types';

interface ReviewDeclarationProps {
    formData: StudentApplicationFormData;
    updateFormData: (data: Partial<StudentApplicationFormData>) => void;
    errors: Record<string, string>;
    goToStep: (step: number) => void;
    programs: Program[];
}

const ReviewDeclaration: React.FC<ReviewDeclarationProps> = ({
    formData,
    updateFormData,
    errors,
    goToStep,
    programs
}) => {
    const selectedProgram = programs.find(p => p.id === formData.programId);

    const Section: React.FC<{ title: string; icon: React.ReactNode; step: number; children: React.ReactNode }> = ({
        title, icon, step, children
    }) => (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    {icon}
                    {title}
                </div>
                <button
                    type="button"
                    onClick={() => goToStep(step)}
                    className="p-2 text-kemu-purple hover:bg-kemu-purple/10 rounded-lg transition-colors flex items-center gap-1 text-sm"
                >
                    <Edit2 size={14} />
                    Edit
                </button>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );

    const InfoRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
        <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className="font-medium text-gray-800 text-sm">{value || '-'}</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-800">Review & Declaration</h2>
                <p className="text-gray-500 mt-2">Please review your application before submitting</p>
            </div>

            {/* Applicant Profile */}
            <Section title="Applicant Profile" icon={<User size={18} className="text-kemu-purple" />} step={1}>
                <div className="grid md:grid-cols-2 gap-x-8">
                    <InfoRow label="Full Name" value={`${formData.firstName} ${formData.lastName}`} />
                    <InfoRow label="Email" value={formData.email} />
                    <InfoRow label="Phone" value={`${formData.phoneCode} ${formData.phone}`} />
                    <InfoRow label="National ID" value={formData.nationalId} />
                    <InfoRow label="Date of Birth" value={formData.dateOfBirth} />
                    <InfoRow label="Nationality" value={formData.nationality} />
                    <div className="md:col-span-2">
                        <InfoRow label="Address" value={formData.physicalAddress} />
                    </div>
                </div>
            </Section>

            {/* Programme Selection */}
            <Section title="Programme Selection" icon={<GraduationCap size={18} className="text-kemu-purple" />} step={2}>
                <div className="grid md:grid-cols-2 gap-x-8">
                    <InfoRow label="Programme" value={selectedProgram?.title} />
                    <InfoRow label="Degree Type" value={selectedProgram?.degreeType} />
                    <InfoRow label="Intake" value={formData.intake} />
                    <InfoRow label="Application Type" value={formData.applicationType} />
                    {formData.applicationType === 'KUCCPS' && (
                        <InfoRow label="KUCCPS Ref" value={formData.kuccpsRefNumber} />
                    )}
                    {formData.applicationType === 'Sponsored' && (
                        <div className="md:col-span-2">
                            <InfoRow label="Sponsor Details" value={formData.sponsorDetails} />
                        </div>
                    )}
                </div>
            </Section>

            {/* Education Background */}
            <Section title="Education Background" icon={<GraduationCap size={18} className="text-kemu-purple" />} step={3}>
                <div className="space-y-3">
                    {formData.educationHistory.map((edu, index) => (
                        <div key={edu.id || index} className="bg-gray-50 rounded-lg p-3">
                            <div className="font-semibold text-gray-800">{edu.level} - {edu.award}</div>
                            <div className="text-sm text-gray-600">{edu.institution} • {edu.year} • Grade: {edu.grade}</div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Documents */}
            <Section title="Documents Uploaded" icon={<FileText size={18} className="text-kemu-purple" />} step={4}>
                <div className="grid md:grid-cols-2 gap-3">
                    <div className={`flex items-center gap-2 p-2 rounded-lg ${formData.passportPhoto ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {formData.passportPhoto ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                        Passport Photo
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-lg ${formData.nationalIdDoc ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {formData.nationalIdDoc ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                        National ID
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-lg ${formData.academicCerts?.length ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {formData.academicCerts?.length ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                        Academic Certificates ({formData.academicCerts?.length || 0})
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-gray-600`}>
                        <FileText size={16} />
                        Supporting Docs ({formData.supportingDocs?.length || 0})
                    </div>
                </div>
            </Section>

            {/* Payment */}
            <Section title="Payment Status" icon={<CreditCard size={18} className="text-kemu-purple" />} step={5}>
                <div className="flex items-center gap-3">
                    {formData.paymentReference ? (
                        <>
                            <CheckCircle2 size={24} className="text-green-600" />
                            <div>
                                <p className="font-semibold text-green-700">Payment Received</p>
                                <p className="text-sm text-gray-600">Reference: {formData.paymentReference}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <AlertTriangle size={24} className="text-amber-600" />
                            <div>
                                <p className="font-semibold text-amber-700">Payment Pending</p>
                                <p className="text-sm text-gray-600">Please complete payment before submitting</p>
                            </div>
                        </>
                    )}
                </div>
            </Section>

            {/* Declaration */}
            <div className="bg-kemu-purple/5 border border-kemu-purple/20 rounded-xl p-6 space-y-4">
                <h4 className="font-bold text-gray-800">Declaration & Consent</h4>

                <label className={`
          flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
          ${formData.declarationAccepted ? 'border-kemu-purple bg-kemu-purple/5' : 'border-gray-200 hover:border-kemu-purple/50'}
          ${errors.declarationAccepted ? 'border-red-300 bg-red-50' : ''}
        `}>
                    <input
                        type="checkbox"
                        checked={formData.declarationAccepted}
                        onChange={(e) => updateFormData({ declarationAccepted: e.target.checked })}
                        className="mt-1 w-5 h-5 text-kemu-purple border-gray-300 rounded focus:ring-kemu-purple"
                    />
                    <span className="text-sm text-gray-700">
                        I hereby declare that all information provided in this application is true, complete, and accurate
                        to the best of my knowledge. I understand that any false or misleading information may result in
                        the cancellation of my application or admission.
                    </span>
                </label>
                {errors.declarationAccepted && <p className="text-red-500 text-sm">{errors.declarationAccepted}</p>}

                <label className={`
          flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
          ${formData.privacyConsent ? 'border-kemu-purple bg-kemu-purple/5' : 'border-gray-200 hover:border-kemu-purple/50'}
          ${errors.privacyConsent ? 'border-red-300 bg-red-50' : ''}
        `}>
                    <input
                        type="checkbox"
                        checked={formData.privacyConsent}
                        onChange={(e) => updateFormData({ privacyConsent: e.target.checked })}
                        className="mt-1 w-5 h-5 text-kemu-purple border-gray-300 rounded focus:ring-kemu-purple"
                    />
                    <span className="text-sm text-gray-700">
                        I consent to Kenya Methodist University collecting, storing, and processing my personal data
                        for the purposes of admission and student records management, in accordance with the Data
                        Protection Act, 2019.
                    </span>
                </label>
                {errors.privacyConsent && <p className="text-red-500 text-sm">{errors.privacyConsent}</p>}
            </div>

            {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertTriangle className="text-red-600" size={20} />
                    <span className="text-red-800">{errors.submit}</span>
                </div>
            )}
        </div>
    );
};

export default ReviewDeclaration;
