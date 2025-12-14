import React from 'react';
import { GraduationCap, Code, FlaskConical, Users, Briefcase, HeartPulse, Scale, Globe, Trophy } from 'lucide-react';
import { PageHero, ContentSection } from '../components/common';

/**
 * Schools Page - Showcases all academic schools and faculties at KeMU
 */

interface School {
    name: string;
    description: string;
    icon: any;
    colorClass: string;
}

const Schools: React.FC = () => {
    const schools: School[] = [
        {
            name: 'School of Computing and Informatics',
            description: 'Offers programmes in computer science, information technology, and modern computing technologies to prepare students for the digital age.',
            icon: Code,
            colorClass: 'from-blue-500/20 to-cyan-600/20'
        },
        {
            name: 'School of Science and Technology',
            description: 'Provides education in natural sciences, applied sciences, and technology fields with focus on innovation and research.',
            icon: FlaskConical,
            colorClass: 'from-green-500/20 to-emerald-600/20'
        },
        {
            name: 'School of Education and Social Sciences',
            description: 'Prepares students for careers in teaching, counselling, and social services with comprehensive education and social science programmes.',
            icon: Users,
            colorClass: 'from-purple-500/20 to-pink-600/20'
        },
        {
            name: 'School of Business and Economics',
            description: 'KeMU Business School offers business and economics programmes including administration, finance, hospitality, tourism management, and international relations.',
            icon: Briefcase,
            colorClass: 'from-kemu-gold/20 to-yellow-600/20'
        },
        {
            name: 'School of Medicine and Health Sciences',
            description: 'The first and only private university in Kenya to graduate medical doctors. Offers programmes in medicine, nursing, public health, nutrition, and health systems management.',
            icon: HeartPulse,
            colorClass: 'from-red-500/20 to-rose-600/20'
        },
        {
            name: 'School of Health Sciences',
            description: 'Offers health-related academic programs contributing to KeMU\'s commitment to producing healthcare professionals for Kenya and beyond.',
            icon: HeartPulse,
            colorClass: 'from-teal-500/20 to-cyan-600/20'
        },
        {
            name: 'School of Economics and Political Sciences',
            description: 'Provides education in economics, political science, and related fields preparing students for careers in policy, governance, and development.',
            icon: Globe,
            colorClass: 'from-indigo-500/20 to-blue-600/20'
        },
        {
            name: 'School of Law',
            description: 'Offers legal education and training to produce competent legal professionals with strong ethical foundations.',
            icon: Scale,
            colorClass: 'from-gray-500/20 to-slate-600/20'
        },
        {
            name: 'Center for Leadership and Professional Development',
            description: 'Provides leadership training and professional development programs supporting the university\'s mission of producing transformational leaders.',
            icon: Trophy,
            colorClass: 'from-kemu-purple/20 to-kemu-blue/20'
        }
    ];

    return (
        <div className="min-h-screen">
            <PageHero
                title="Our Schools & Faculties"
                subtitle="Explore our diverse academic schools offering quality education across various disciplines"
            />

            <div className="container mx-auto max-w-7xl px-4 py-12">
                {/* Introduction */}
                <ContentSection glass className="mb-12">
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed text-lg text-center">
                            Kenya Methodist University comprises <strong className="text-kemu-purple">9 schools and centers</strong> offering a comprehensive range of programmes from certificate to PhD level. Each school is dedicated to academic excellence and producing professionally competent graduates.
                        </p>
                    </div>
                </ContentSection>

                {/* Schools Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schools.map((school, index) => {
                        const Icon = school.icon;
                        return (
                            <div
                                key={index}
                                className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-xl p-6 hover:shadow-deep-3d hover:scale-105 transition-all duration-300 animate-slide-up-fade"
                                style={{ animationDelay: `${(index % 9) * 0.1}s` }}
                            >
                                {/* Icon */}
                                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${school.colorClass} mb-4`}>
                                    <Icon size={32} className="text-kemu-purple" />
                                </div>

                                {/* School Name */}
                                <h3 className="text-xl font-bold text-kemu-purple mb-3">
                                    {school.name}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                    {school.description}
                                </p>

                                {/* CTA */}
                                <a
                                    href="/#/programmes"
                                    className="inline-flex items-center text-kemu-gold font-semibold text-sm hover:text-kemu-blue transition-colors"
                                >
                                    View Programmes
                                    <GraduationCap size={16} className="ml-2" />
                                </a>
                            </div>
                        );
                    })}
                </div>

                {/* Stats Section */}
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    <ContentSection glass className="text-center">
                        <div className="text-4xl font-bold text-kemu-purple mb-2">9</div>
                        <div className="text-sm text-gray-600">Schools & Centers</div>
                    </ContentSection>
                    <ContentSection glass className="text-center">
                        <div className="text-4xl font-bold text-kemu-gold mb-2">100+</div>
                        <div className="text-sm text-gray-600">Academic Programmes</div>
                    </ContentSection>
                    <ContentSection glass className="text-center">
                        <div className="text-4xl font-bold text-kemu-blue mb-2">5</div>
                        <div className="text-sm text-gray-600">Academic Levels</div>
                    </ContentSection>
                </div>
            </div>
        </div>
    );
};

export default Schools;
