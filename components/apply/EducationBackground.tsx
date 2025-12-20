import React from 'react';
import { Plus, Trash2, GraduationCap, School, Award, Calendar, BarChart2 } from 'lucide-react';
import { StudentApplicationFormData, EducationEntry } from '../../types';

interface EducationBackgroundProps {
    formData: StudentApplicationFormData;
    updateFormData: (data: Partial<StudentApplicationFormData>) => void;
    errors: Record<string, string>;
}

const educationLevels = [
    'KCSE',
    'KCPE',
    'O-Level',
    'A-Level',
    'Certificate',
    'Diploma',
    'Higher Diploma',
    'Degree',
    "Master's Degree",
    'PhD',
    'Craft Certificate',
    'Artisan Certificate',
    'Other'
];

const generateId = () => Math.random().toString(36).substr(2, 9);

const EducationBackground: React.FC<EducationBackgroundProps> = ({
    formData,
    updateFormData,
    errors
}) => {
    const addEducation = () => {
        const newEntry: EducationEntry = {
            id: generateId(),
            level: '',
            institution: '',
            award: '',
            year: '',
            grade: ''
        };
        updateFormData({
            educationHistory: [...formData.educationHistory, newEntry]
        });
    };

    const removeEducation = (id: string) => {
        if (formData.educationHistory.length > 1) {
            updateFormData({
                educationHistory: formData.educationHistory.filter(e => e.id !== id)
            });
        }
    };

    const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
        updateFormData({
            educationHistory: formData.educationHistory.map(e =>
                e.id === id ? { ...e, [field]: value } : e
            )
        });
    };

    const inputClass = `
    w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-300
    border-gray-200 focus:border-kemu-purple focus:ring-kemu-purple/20
    focus:outline-none focus:ring-4 text-sm
  `;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-800">Education Background</h2>
                <p className="text-gray-500 mt-2">Add your educational qualifications (most recent first)</p>
            </div>

            {/* Education Entries */}
            <div className="space-y-6">
                {formData.educationHistory.map((entry, index) => (
                    <div
                        key={entry.id}
                        className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-700 flex items-center gap-2">
                                <GraduationCap size={18} className="text-kemu-purple" />
                                Education #{index + 1}
                            </h4>
                            {formData.educationHistory.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeEducation(entry.id!)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove entry"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Education Level */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                                    <GraduationCap size={14} />
                                    Education Level *
                                </label>
                                <select
                                    value={entry.level}
                                    onChange={(e) => updateEducation(entry.id!, 'level', e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="">Select level</option>
                                    {educationLevels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Institution */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                                    <School size={14} />
                                    Institution Name *
                                </label>
                                <input
                                    type="text"
                                    value={entry.institution}
                                    onChange={(e) => updateEducation(entry.id!, 'institution', e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g., Kenya High School"
                                />
                            </div>

                            {/* Award / Certificate */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                                    <Award size={14} />
                                    Award / Certificate *
                                </label>
                                <input
                                    type="text"
                                    value={entry.award}
                                    onChange={(e) => updateEducation(entry.id!, 'award', e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g., KCSE Certificate"
                                />
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                                    <Calendar size={14} />
                                    Year Completed *
                                </label>
                                <input
                                    type="text"
                                    value={entry.year}
                                    onChange={(e) => updateEducation(entry.id!, 'year', e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g., 2023"
                                    maxLength={4}
                                />
                            </div>

                            {/* Grade */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                                    <BarChart2 size={14} />
                                    Grade / GPA *
                                </label>
                                <input
                                    type="text"
                                    value={entry.grade}
                                    onChange={(e) => updateEducation(entry.id!, 'grade', e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g., A-, B+, 3.5 GPA"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {errors.educationHistory && (
                <p className="text-red-500 text-sm">{errors.educationHistory}</p>
            )}

            {/* Add Education Button */}
            <button
                type="button"
                onClick={addEducation}
                className="w-full py-4 border-2 border-dashed border-kemu-purple/40 rounded-xl
          text-kemu-purple font-semibold flex items-center justify-center gap-2
          hover:bg-kemu-purple/5 hover:border-kemu-purple transition-all duration-300"
            >
                <Plus size={20} />
                Add Another Education Entry
            </button>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Add all relevant educational qualifications. For TVET applicants, include
                    craft certificates and artisan credentials. Mature entry applicants should include work experience
                    and relevant professional qualifications.
                </p>
            </div>
        </div>
    );
};

export default EducationBackground;
