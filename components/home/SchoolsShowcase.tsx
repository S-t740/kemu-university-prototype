import React from 'react';
import { GraduationCap, Briefcase, Stethoscope, Scale, Users, BookOpen, FlaskConical, Globe, Award } from 'lucide-react';

/**
 * SchoolsShowcase Component - Premium schools grid with ambient glow
 * Features responsive grid, glass cards, and staggered animations
 */

interface SchoolCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    delay: number;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ icon: Icon, title, description, delay }) => {
    return (
        <div
            className="group relative backdrop-blur-xl bg-white/25 border border-white/40 rounded-2xl p-6 shadow-soft-3d hover:shadow-deep-3d hover:scale-105 hover:bg-white/35 transition-all duration-300 animate-slide-up-fade"
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Icon */}
            <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-kemu-purple/20 to-kemu-gold/20 group-hover:from-kemu-purple/30 group-hover:to-kemu-gold/30 transition-all flex-shrink-0">
                    <Icon size={24} className="text-kemu-purple" />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-serif font-bold text-kemu-purple leading-tight">
                    {title}
                </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 leading-relaxed">
                {description}
            </p>

            {/* Hover Accent */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-kemu-purple/0 to-kemu-gold/0 group-hover:from-kemu-purple/5 group-hover:to-kemu-gold/5 pointer-events-none transition-all duration-300"></div>
        </div>
    );
};

const SchoolsShowcase: React.FC = () => {
    const schools = [
        {
            icon: GraduationCap,
            title: "School of Economics and Management",
            description: "Business Administration, Economics, Accounting, Finance, and Entrepreneurship programs designed for modern business leaders."
        },
        {
            icon: Briefcase,
            title: "School of Business and Economics",
            description: "Comprehensive business education with focus on strategy, leadership, and sustainable business practices."
        },
        {
            icon: Stethoscope,
            title: "School of Medicine and Health Sciences",
            description: "Medical Doctor program, Nursing, Clinical Medicine, Public Health, and allied health sciences training."
        },
        {
            icon: Scale,
            title: "School of Law",
            description: "Bachelor of Laws (LL.B) and legal training in various areas of jurisprudence and legal practice."
        },
        {
            icon: Users,
            title: "School of Education and Social Sciences",
            description: "Teacher training, Psychology, Sociology, and comprehensive social sciences education programs."
        },
        {
            icon: BookOpen,
            title: "School of Pure and Applied Sciences",
            description: "Mathematics, Physics, Chemistry, Biology, Computer Science, and applied sciences programs."
        },
        {
            icon: FlaskConical,
            title: "School of Hospitality and Tourism Management",
            description: "Hospitality, Tourism, Events Management, and culinary arts programs for the service industry."
        },
        {
            icon: Globe,
            title: "School of Environment and Earth Sciences",
            description: "Environmental Science, Geography, Earth Sciences, and sustainable development programs."
        },
        {
            icon: Award,
            title: "Directorate of Postgraduate Studies",
            description: "Masters and PhD programs across all disciplines with research excellence and innovation focus."
        }
    ];

    return (
        <section className="relative py-16 md:py-24 px-4 overflow-hidden">
            {/* Ambient Glow Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-kemu-purple/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-kemu-gold/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-kemu-blue">
                        Our Schools & Directorates
                    </h2>
                    <div className="h-1 w-24 bg-kemu-gold mx-auto rounded-full"></div>
                    <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
                        Kenya Methodist University offers diverse programmes across multiple schools and directorates
                    </p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schools.map((school, index) => (
                        <SchoolCard
                            key={index}
                            icon={school.icon}
                            title={school.title}
                            description={school.description}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SchoolsShowcase;
