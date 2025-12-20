import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Applicant } from '../types';
import { loginApplicant, registerApplicant, getApplicantProfile } from '../services/api';

const APPLICANT_TOKEN_KEY = 'kemu_applicant_token';

interface ApplicantAuthContextType {
    applicant: Applicant | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    phoneCode?: string;
    nationalId?: string;
}

const ApplicantAuthContext = createContext<ApplicantAuthContextType | undefined>(undefined);

export const ApplicantAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [applicant, setApplicant] = useState<Applicant | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem(APPLICANT_TOKEN_KEY);
            if (token) {
                try {
                    const response = await getApplicantProfile();
                    if (response.success && response.applicant) {
                        setApplicant(response.applicant);
                    }
                } catch (error) {
                    // Token invalid, remove it
                    localStorage.removeItem(APPLICANT_TOKEN_KEY);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await loginApplicant(email, password);
            if (response.success && response.token && response.applicant) {
                localStorage.setItem(APPLICANT_TOKEN_KEY, response.token);
                setApplicant(response.applicant);
                return { success: true };
            }
            return { success: false, error: response.error || 'Login failed' };
        } catch (error: any) {
            return { success: false, error: error.message || 'Login failed' };
        }
    };

    const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await registerApplicant(data);
            if (response.success && response.token && response.applicant) {
                localStorage.setItem(APPLICANT_TOKEN_KEY, response.token);
                setApplicant(response.applicant);
                return { success: true };
            }
            return { success: false, error: response.error || 'Registration failed' };
        } catch (error: any) {
            return { success: false, error: error.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem(APPLICANT_TOKEN_KEY);
        setApplicant(null);
    };

    const refreshProfile = async () => {
        try {
            const response = await getApplicantProfile();
            if (response.success && response.applicant) {
                setApplicant(response.applicant);
            }
        } catch (error) {
            // Ignore errors
        }
    };

    return (
        <ApplicantAuthContext.Provider
            value={{
                applicant,
                isAuthenticated: !!applicant,
                isLoading,
                login,
                register,
                logout,
                refreshProfile
            }}
        >
            {children}
        </ApplicantAuthContext.Provider>
    );
};

export const useApplicantAuth = (): ApplicantAuthContextType => {
    const context = useContext(ApplicantAuthContext);
    if (!context) {
        throw new Error('useApplicantAuth must be used within an ApplicantAuthProvider');
    }
    return context;
};

export default ApplicantAuthContext;
