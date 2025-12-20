import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Mail, Lock, User, Phone, IdCard, ArrowRight, Loader2,
    Eye, EyeOff, Sparkles, CheckCircle, RefreshCw
} from 'lucide-react';
import { registerApplicant, verifyOTP, resendOTP } from '../services/api';
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

    // Step: 'form' | 'verify'
    const [step, setStep] = useState<'form' | 'verify'>('form');
    const [registeredEmail, setRegisteredEmail] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        phoneCode: '+254',
        nationalId: '',
        password: '',
        confirmPassword: '',
        otpMethod: 'email' as 'email' | 'phone'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // OTP state
    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resendLoading, setResendLoading] = useState(false);
    const [verifyError, setVerifyError] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from || '/applicant/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

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

        if (formData.otpMethod === 'phone' && !formData.phone) {
            setError('Phone number is required for SMS verification');
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
                nationalId: formData.nationalId || undefined,
                otpMethod: formData.otpMethod
            });

            if (response.requiresVerification) {
                setRegisteredEmail(formData.email);
                setStep('verify');
                setResendCooldown(60);
            } else if (response.token) {
                // Legacy: auto-login if token returned
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

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            setVerifyError('Please enter the 6-digit code');
            return;
        }

        setVerifying(true);
        setVerifyError('');

        try {
            const response = await verifyOTP(registeredEmail, otp);
            if (response.success && response.token) {
                localStorage.setItem(APPLICANT_TOKEN_KEY, response.token);
                await refreshProfile();
                const from = (location.state as any)?.from || '/applicant/dashboard';
                navigate(from, { replace: true });
            }
        } catch (err: any) {
            setVerifyError(err.message || 'Verification failed');
        } finally {
            setVerifying(false);
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true);
        setVerifyError('');

        try {
            await resendOTP(registeredEmail);
            setResendCooldown(60);
        } catch (err: any) {
            setVerifyError(err.message || 'Failed to resend code');
        } finally {
            setResendLoading(false);
        }
    };

    // OTP Verification Step
    if (step === 'verify') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-kemu-purple/5 to-white flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} className="text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Verify Your Account</h2>
                            <p className="text-gray-600 mt-2">
                                We sent a verification code to your {formData.otpMethod === 'phone' ? 'phone' : 'email'}
                            </p>
                            <p className="text-kemu-purple font-medium mt-1">
                                {formData.otpMethod === 'phone'
                                    ? `${formData.phoneCode} ${formData.phone}`
                                    : registeredEmail
                                }
                            </p>
                        </div>

                        {verifyError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
                                {verifyError}
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Enter 6-Digit Code
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setOtp(value);
                                    setVerifyError('');
                                }}
                                placeholder="000000"
                                maxLength={6}
                                className="w-full px-4 py-4 text-center text-2xl font-mono tracking-widest border-2 
                                    border-gray-200 rounded-xl focus:border-kemu-purple focus:outline-none"
                                autoFocus
                            />
                        </div>

                        <button
                            onClick={handleVerifyOTP}
                            disabled={verifying || otp.length !== 6}
                            className="w-full py-3 bg-gradient-to-r from-kemu-purple to-kemu-gold text-white 
                                rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 
                                flex items-center justify-center gap-2"
                        >
                            {verifying ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Verify & Continue
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-sm mb-2">Didn't receive the code?</p>
                            {resendCooldown > 0 ? (
                                <p className="text-gray-400 text-sm">
                                    Resend in {resendCooldown} seconds
                                </p>
                            ) : (
                                <button
                                    onClick={handleResendOTP}
                                    disabled={resendLoading}
                                    className="text-kemu-purple font-medium hover:underline flex items-center justify-center gap-2"
                                >
                                    {resendLoading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <RefreshCw size={16} />
                                    )}
                                    Resend Code
                                </button>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t text-center">
                            <button
                                onClick={() => setStep('form')}
                                className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                                ← Back to registration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Registration Form Step
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
                                Phone Number {formData.otpMethod === 'phone' && <span className="text-red-500">*</span>}
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
                        <div className="grid grid-cols-2 gap-4 mb-4">
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

                        {/* OTP Method Selection */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Verify your account via:
                            </label>
                            <div className="flex gap-4">
                                <label className="flex-1 flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors hover:bg-white"
                                    style={{ borderColor: formData.otpMethod === 'email' ? '#871054' : '#e5e7eb' }}
                                >
                                    <input
                                        type="radio"
                                        name="otpMethod"
                                        value="email"
                                        checked={formData.otpMethod === 'email'}
                                        onChange={handleChange}
                                        className="accent-kemu-purple"
                                    />
                                    <Mail size={18} className="text-gray-500" />
                                    <span className="font-medium text-gray-700">Email</span>
                                </label>
                                <label className="flex-1 flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors hover:bg-white"
                                    style={{ borderColor: formData.otpMethod === 'phone' ? '#871054' : '#e5e7eb' }}
                                >
                                    <input
                                        type="radio"
                                        name="otpMethod"
                                        value="phone"
                                        checked={formData.otpMethod === 'phone'}
                                        onChange={handleChange}
                                        className="accent-kemu-purple"
                                    />
                                    <Phone size={18} className="text-gray-500" />
                                    <span className="font-medium text-gray-700">Phone</span>
                                </label>
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
