import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Globe, CreditCard } from 'lucide-react';
import { StudentApplicationFormData, PhoneCountry } from '../../types';

interface ApplicantProfileProps {
    formData: StudentApplicationFormData;
    updateFormData: (data: Partial<StudentApplicationFormData>) => void;
    errors: Record<string, string>;
    phoneCountries: PhoneCountry[];
}

const ApplicantProfile: React.FC<ApplicantProfileProps> = ({
    formData,
    updateFormData,
    errors,
    phoneCountries
}) => {
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
                <h2 className="text-2xl font-serif font-bold text-gray-800">Applicant Profile</h2>
                <p className="text-gray-500 mt-2">Please provide your personal information</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User size={16} className="inline mr-2 text-kemu-purple" />
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateFormData({ firstName: e.target.value })}
                        className={inputClass('firstName')}
                        placeholder="John"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User size={16} className="inline mr-2 text-kemu-purple" />
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateFormData({ lastName: e.target.value })}
                        className={inputClass('lastName')}
                        placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail size={16} className="inline mr-2 text-kemu-purple" />
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData({ email: e.target.value })}
                        className={inputClass('email')}
                        placeholder="john.doe@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone size={16} className="inline mr-2 text-kemu-purple" />
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <select
                            value={formData.phoneCode}
                            onChange={(e) => updateFormData({ phoneCode: e.target.value })}
                            className="w-28 px-2 py-3 rounded-xl border-2 border-gray-200 focus:border-kemu-purple focus:outline-none focus:ring-4 focus:ring-kemu-purple/20"
                        >
                            {phoneCountries.map((country) => (
                                <option key={country.code} value={country.dial_code}>
                                    {country.flag} {country.dial_code}
                                </option>
                            ))}
                        </select>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateFormData({ phone: e.target.value })}
                            className={`flex-1 ${inputClass('phone')}`}
                            placeholder="712345678"
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* National ID */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <CreditCard size={16} className="inline mr-2 text-kemu-purple" />
                        National ID / Passport <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.nationalId}
                        onChange={(e) => updateFormData({ nationalId: e.target.value })}
                        className={inputClass('nationalId')}
                        placeholder="12345678"
                    />
                    {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar size={16} className="inline mr-2 text-kemu-purple" />
                        Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
                        className={inputClass('dateOfBirth')}
                        max={new Date().toISOString().split('T')[0]}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                {/* Nationality */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Globe size={16} className="inline mr-2 text-kemu-purple" />
                        Nationality <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => updateFormData({ nationality: e.target.value })}
                        className={inputClass('nationality')}
                        placeholder="Kenyan"
                    />
                    {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
                </div>

                {/* Physical Address */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin size={16} className="inline mr-2 text-kemu-purple" />
                        Physical Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.physicalAddress}
                        onChange={(e) => updateFormData({ physicalAddress: e.target.value })}
                        className={`${inputClass('physicalAddress')} resize-none`}
                        rows={3}
                        placeholder="P.O. Box 123, Nairobi, Kenya"
                    />
                    {errors.physicalAddress && <p className="text-red-500 text-sm mt-1">{errors.physicalAddress}</p>}
                </div>
            </div>
        </div>
    );
};

export default ApplicantProfile;
