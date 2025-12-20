import React from 'react';
import { GraduationCap, Calendar, FileQuestion, Info, AlertCircle } from 'lucide-react';
import { StudentApplicationFormData, Program, ApplicationType, IntakePeriod } from '../../types';

interface ProgrammeSelectionProps {
    formData: StudentApplicationFormData;
    updateFormData: (data: Partial<StudentApplicationFormData>) => void;
    errors: Record<string, string>;
    programs: Program[];
    loadingPrograms: boolean;
}

const intakes: IntakePeriod[] = ['January', 'May', 'September'];
const applicationTypes: { value: ApplicationType; label: string; description: string }[] = [
    { value: 'Direct', label: 'Direct Entry', description: 'Apply directly with your certificates' },
    { value: 'KUCCPS', label: 'KUCCPS', description: 'Placed by Kenya Universities and Colleges Central Placement Service' },
    { value: 'Sponsored', label: 'Sponsored', description: 'Application sponsored by an organization' }
];

const ProgrammeSelection: React.FC<ProgrammeSelectionProps> = ({
    formData,
    updateFormData,
    errors,
    programs,
    loadingPrograms
}) => {
    const selectedProgram = programs.find(p => p.id === formData.programId);

    const inputClass = (field: string) => `
    w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
    ${errors[field]
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-200 focus:border-kemu-purple focus:ring-kemu-purple/20'
        }
    focus:outline-none focus:ring-4
  `;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-800">Programme Selection</h2>
                <p className="text-gray-500 mt-2">Choose your preferred programme and intake</p>
            </div>

            {/* Programme Selection */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap size={16} className="inline mr-2 text-kemu-purple" />
                    Select Programme <span className="text-red-500">*</span>
                </label>
                {loadingPrograms ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-kemu-purple border-t-transparent" />
                    </div>
                ) : (
                    <select
                        value={formData.programId || ''}
                        onChange={(e) => updateFormData({ programId: e.target.value ? parseInt(e.target.value) : null })}
                        className={inputClass('programId')}
                    >
                        <option value="">-- Select a Programme --</option>
                        {programs.map((program) => (
                            <option key={program.id} value={program.id}>
                                {program.title} ({program.degreeType})
                            </option>
                        ))}
                    </select>
                )}
                {errors.programId && <p className="text-red-500 text-sm mt-1">{errors.programId}</p>}
            </div>

            {/* Selected Programme Info */}
            {selectedProgram && (
                <div className="bg-kemu-purple/5 border border-kemu-purple/20 rounded-xl p-4">
                    <h4 className="font-bold text-kemu-purple flex items-center gap-2">
                        <Info size={18} />
                        Programme Details
                    </h4>
                    <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-gray-500">Degree Type:</span>
                            <span className="ml-2 font-medium">{selectedProgram.degreeType}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Duration:</span>
                            <span className="ml-2 font-medium">{selectedProgram.duration || 'N/A'}</span>
                        </div>
                        {selectedProgram.school && (
                            <div className="md:col-span-2">
                                <span className="text-gray-500">School:</span>
                                <span className="ml-2 font-medium">{selectedProgram.school.name}</span>
                            </div>
                        )}
                        {selectedProgram.requirements && (
                            <div className="md:col-span-2">
                                <span className="text-gray-500">Entry Requirements:</span>
                                <p className="mt-1 text-gray-700">{selectedProgram.requirements}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Intake Selection */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-2 text-kemu-purple" />
                    Preferred Intake <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                    {intakes.map((intake) => (
                        <button
                            key={intake}
                            type="button"
                            onClick={() => updateFormData({ intake })}
                            className={`
                p-4 rounded-xl border-2 transition-all duration-300 text-center
                ${formData.intake === intake
                                    ? 'border-kemu-purple bg-kemu-purple/10 text-kemu-purple font-bold'
                                    : 'border-gray-200 hover:border-kemu-purple/50 text-gray-600'
                                }
              `}
                        >
                            {intake}
                        </button>
                    ))}
                </div>
                {errors.intake && <p className="text-red-500 text-sm mt-1">{errors.intake}</p>}
            </div>

            {/* Application Type */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileQuestion size={16} className="inline mr-2 text-kemu-purple" />
                    Application Type <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                    {applicationTypes.map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => updateFormData({ applicationType: type.value })}
                            className={`
                w-full p-4 rounded-xl border-2 transition-all duration-300 text-left
                ${formData.applicationType === type.value
                                    ? 'border-kemu-purple bg-kemu-purple/10'
                                    : 'border-gray-200 hover:border-kemu-purple/50'
                                }
              `}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`
                  w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5
                  ${formData.applicationType === type.value
                                        ? 'border-kemu-purple bg-kemu-purple'
                                        : 'border-gray-300'
                                    }
                `}>
                                    {formData.applicationType === type.value && (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className={`font-semibold ${formData.applicationType === type.value ? 'text-kemu-purple' : 'text-gray-800'}`}>
                                        {type.label}
                                    </p>
                                    <p className="text-sm text-gray-500">{type.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
                {errors.applicationType && <p className="text-red-500 text-sm mt-1">{errors.applicationType}</p>}
            </div>

            {/* KUCCPS Reference Number */}
            {formData.applicationType === 'KUCCPS' && (
                <div className="animate-fade-up">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        KUCCPS Reference Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.kuccpsRefNumber || ''}
                        onChange={(e) => updateFormData({ kuccpsRefNumber: e.target.value })}
                        className={inputClass('kuccpsRefNumber')}
                        placeholder="Enter your KUCCPS reference number"
                    />
                    {errors.kuccpsRefNumber && <p className="text-red-500 text-sm mt-1">{errors.kuccpsRefNumber}</p>}
                </div>
            )}

            {/* Sponsor Details */}
            {formData.applicationType === 'Sponsored' && (
                <div className="animate-fade-up">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sponsor Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.sponsorDetails || ''}
                        onChange={(e) => updateFormData({ sponsorDetails: e.target.value })}
                        className={`${inputClass('sponsorDetails')} resize-none`}
                        rows={3}
                        placeholder="Name of sponsoring organization, contact details, etc."
                    />
                    {errors.sponsorDetails && <p className="text-red-500 text-sm mt-1">{errors.sponsorDetails}</p>}
                </div>
            )}

            {/* Deadline Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                    <p className="font-semibold text-amber-800">Application Deadline</p>
                    <p className="text-sm text-amber-700">
                        Please ensure you submit your application before the intake deadline. Late applications may not be processed.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProgrammeSelection;
