import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Mail, Lock, User, Phone, IdCard, ArrowRight, Loader2,
    Eye, EyeOff, Sparkles
} from 'lucide-react';
import { registerApplicant } from '../services/api';
import { useApplicantAuth } from '../contexts/ApplicantAuthContext';

interface PhoneCountry {
    code: string;
    name: string;
    dial_code: string;
    flag: string;
}

const phoneCountries: PhoneCountry[] = [
    { code: 'KE', name: 'Kenya', dial_code: '+254', flag: '🇰🇪' },
    { code: 'UG', name: 'Uganda', dial_code: '+256', flag: '🇺🇬' },
    { code: 'TZ', name: 'Tanzania', dial_code: '+255', flag: '🇹🇿' },
    { code: 'RW', name: 'Rwanda', dial_code: '+250', flag: '🇷🇼' },
    { code: 'ET', name: 'Ethiopia', dial_code: '+251', flag: '🇪🇹' },
    { code: 'NG', name: 'Nigeria', dial_code: '+234', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', dial_code: '+233', flag: '🇬🇭' },
    { code: 'ZA', name: 'South Africa', dial_code: '+27', flag: '🇿🇦' },
    { code: 'US', name: 'United States', dial_code: '+1', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', dial_code: '+44', flag: '🇬🇧' }
];

const APPLICANT_TOKEN_KEY = 'kemu_applicant_token';

const ApplicantRegister: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshProfile, isAuthenticated } = useApplicantAuth();

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        phoneCode: '+254',
        nationalId: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from || '/applicant/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await registerApplicant({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone || undefined,
                phoneCode: formData.phoneCode,
                nationalId: formData.nationalId || undefined
            });

            if (response.token) {
                // Auto-login with returned token
                localStorage.setItem(APPLICANT_TOKEN_KEY, response.token);
                await refreshProfile();
                const from = (location.state as any)?.from || '/applicant/dashboard';
                navigate(from, { replace: true });
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-kemu-purple/5 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-kemu-purple via-kemu-blue to-kemu-purple py-10 px-4">
                <div className="container mx-auto max-w-md text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-sm mb-4">
                        <Sparkles size={16} className="text-kemu-gold" />
                        <span>Applicant Portal</span>
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-white">Create Account</h1>
                    <p className="text-white/80 mt-2">Register to start your application</p>
                </div>
            </div>

            <div className="container mx-auto max-w-md px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-kemu-purple focus:outline-none"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-kemu-purple focus:outline-none"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-kemu-purple focus:outline-none"
                                    placeholder="john.doe@email.com"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <div className="flex gap-2">
                                <select
                                    name="phoneCode"
                                    value={formData.phoneCode}
                                    onChange={handleChange}
                                    className="w-28 px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-kemu-purple focus:outline-none"
                                >
                                    {phoneCountries.map(c => (
                                        <option key={c.code} value={c.dial_code}>
                                            {c.flag} {c.dial_code}
                                        </option>
                                    ))}
                                </select>
                                <div className="relative flex-1">
                                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-kemu-purple focus:outline-none"
                                        placeholder="712 345 678"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* National ID */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                National ID <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <div className="relative">
                                <IdCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="nationalId"
                                    value={formData.nationalId}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-kemu-purple focus:outline-none"
                                    placeholder="12345678"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-kemu-purple focus:outline-none"
                                        placeholder="••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-kemu-purple focus:outline-none"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-kemu-purple to-kemu-gold text-white 
                                rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 
                                flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/applicant/login" className="text-kemu-purple font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ApplicantRegister;
