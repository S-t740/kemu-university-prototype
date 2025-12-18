import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHero } from '../components/common';
import { GlassSection } from '../components';
import { ExternalLink, User, Monitor, Users, Headphones, ArrowRight } from 'lucide-react';

/**
 * Portals Page - Central hub for all university portals
 * Features Student Portal, Digital Campus, Staff Portal, ICT Support
 */

interface PortalItem {
    id: string;
    title: string;
    description: string;
    url: string;
    icon: React.ReactNode;
    color: string;
    features: string[];
}

const Portals: React.FC = () => {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState<string>('');

    const portals: PortalItem[] = [
        {
            id: 'students',
            title: 'Student Portal',
            description: 'Access your academic records, course registration, fee statements, exam results, and all student services in one place.',
            url: 'https://students.kemu.ac.ke',
            icon: <User size={32} className="text-white" />,
            color: 'from-kemu-purple to-kemu-blue',
            features: [
                'Course Registration',
                'Fee Payment & Statements',
                'Exam Results & Transcripts',
                'Timetable Access',
                'Academic Progress Tracking',
                'Hostel Booking'
            ]
        },
        {
            id: 'digital-campus',
            title: 'Digital Campus (eLearning)',
            description: 'Access online courses, learning materials, assignments, and virtual classrooms for flexible learning.',
            url: 'https://learn.kemu.ac.ke/',
            icon: <Monitor size={32} className="text-white" />,
            color: 'from-kemu-gold to-yellow-600',
            features: [
                'Online Course Materials',
                'Virtual Classrooms',
                'Assignment Submission',
                'Discussion Forums',
                'Video Lectures',
                'Online Assessments'
            ]
        },
        {
            id: 'staff',
            title: 'Staff Portal',
            description: 'Employee self-service portal for payslips, leave management, HR services, and internal communications.',
            url: 'https://staff.kemu.ac.ke',
            icon: <Users size={32} className="text-white" />,
            color: 'from-green-600 to-emerald-700',
            features: [
                'Payslip Access',
                'Leave Applications',
                'HR Self-Service',
                'Internal Communications',
                'Performance Management',
                'Staff Directory'
            ]
        },
        {
            id: 'ict-support',
            title: 'ICT Support',
            description: 'Get technical assistance, report issues, request services, and access IT resources and guides.',
            url: 'https://helpdesk.kemu.ac.ke/index.php',
            icon: <Headphones size={32} className="text-white" />,
            color: 'from-blue-600 to-indigo-700',
            features: [
                'IT Helpdesk & Ticketing',
                'Password Reset',
                'Email Support',
                'Network Access',
                'Software Requests',
                'IT Guides & FAQs'
            ]
        }
    ];

    // Handle hash navigation
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash) {
            setActiveSection(hash);
            setTimeout(() => {
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [location.hash]);

    return (
        <div className="min-h-screen">
            <PageHero
                title="University Portals"
                subtitle="Access all KeMU online services and resources in one place"
            />

            <div className="container mx-auto max-w-6xl px-4 py-12">
                {/* Quick Access Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {portals.map((portal) => (
                        <a
                            key={portal.id}
                            href={`#${portal.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveSection(portal.id);
                                const element = document.getElementById(portal.id);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                            className={`backdrop-blur-xl bg-white/40 border border-white/60 rounded-xl p-4 hover:shadow-deep-3d hover:scale-105 transition-all duration-300 text-center ${activeSection === portal.id ? 'ring-2 ring-kemu-gold shadow-glow-gold' : ''
                                }`}
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${portal.color} mb-3 shadow-lg`}>
                                {portal.icon}
                            </div>
                            <h3 className="font-bold text-kemu-purple text-sm">{portal.title}</h3>
                        </a>
                    ))}
                </div>

                {/* Portal Details */}
                <div className="space-y-8">
                    {portals.map((portal, index) => (
                        <div
                            key={portal.id}
                            id={portal.id}
                            className="scroll-mt-24"
                        >
                            <GlassSection>
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Icon & Title */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center shadow-deep-3d`}>
                                            {portal.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-serif font-bold text-kemu-purple mb-3">
                                            {portal.title}
                                        </h2>
                                        <p className="text-gray-700 mb-4 leading-relaxed">
                                            {portal.description}
                                        </p>

                                        {/* Features Grid */}
                                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                                            {portal.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-kemu-gold flex-shrink-0" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        {/* CTA Button */}
                                        <a
                                            href={portal.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${portal.color} text-white font-bold shadow-deep-3d hover:shadow-glow-gold hover:scale-105 transition-all duration-300`}
                                        >
                                            Access {portal.title}
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>
                                </div>
                            </GlassSection>
                        </div>
                    ))}
                </div>

                {/* Help Section */}
                <div className="mt-12">
                    <GlassSection>
                        <div className="text-center">
                            <h3 className="text-2xl font-serif font-bold text-kemu-purple mb-3">
                                Need Help Accessing a Portal?
                            </h3>
                            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                                If you're having trouble accessing any of the university portals, please contact the ICT Helpdesk for assistance.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href="mailto:ict@kemu.ac.ke"
                                    className="px-6 py-3 rounded-xl bg-kemu-purple text-white font-bold hover:bg-kemu-blue transition-colors"
                                >
                                    Email: ict@kemu.ac.ke
                                </a>
                                <a
                                    href="tel:+254712345678"
                                    className="px-6 py-3 rounded-xl bg-white/60 border-2 border-kemu-purple text-kemu-purple font-bold hover:bg-white/80 transition-colors"
                                >
                                    Call: +254 712 345 678
                                </a>
                            </div>
                        </div>
                    </GlassSection>
                </div>
            </div>
        </div>
    );
};

export default Portals;
