import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, Stethoscope, Scale, Users, BookOpen, FlaskConical, Globe, Award, Building, Lightbulb, Target, TrendingUp, Loader2 } from 'lucide-react';
import { getSchools, getDirectorates } from '../../services/api';
import { School, Directorate } from '../../types';

/**
 * SchoolsShowcase Component - Premium schools grid with ambient glow
 * Features responsive grid, glass cards, and staggered animations
 * Now fetches data dynamically from the backend API
 */

interface SchoolCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    delay: number;
    isDirectorate?: boolean;
}

// Map school/directorate names to appropriate icons
const getIconForName = (name: string): React.ElementType => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('computing') || lowerName.includes('informatics')) return FlaskConical;
    if (lowerName.includes('business') || lowerName.includes('economics')) return Briefcase;
    if (lowerName.includes('medicine') || lowerName.includes('health') || lowerName.includes('pharmacy')) return Stethoscope;
    if (lowerName.includes('law')) return Scale;
    if (lowerName.includes('education') || lowerName.includes('social')) return Users;
    if (lowerName.includes('science') || lowerName.includes('technology')) return BookOpen;
    if (lowerName.includes('leadership') || lowerName.includes('professional')) return Award;
    if (lowerName.includes('research') || lowerName.includes('innovation')) return Lightbulb;
    if (lowerName.includes('quality') || lowerName.includes('assurance')) return Target;
    if (lowerName.includes('marketing') || lowerName.includes('advancement')) return TrendingUp;
    if (lowerName.includes('political')) return Globe;
    return GraduationCap;
};

const SchoolCard: React.FC<SchoolCardProps> = ({ icon: Icon, title, description, delay, isDirectorate }) => {
    return (
        <div
            className={`group relative backdrop-blur-xl bg-white/25 border border-white/40 rounded-2xl p-6 shadow-soft-3d hover:shadow-deep-3d hover:scale-105 hover:bg-white/35 transition-all duration-300 animate-slide-up-fade ${isDirectorate ? 'border-l-4 border-l-kemu-gold' : ''}`}
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Icon */}
            <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl ${isDirectorate ? 'bg-gradient-to-br from-kemu-gold/20 to-kemu-purple/20' : 'bg-gradient-to-br from-kemu-purple/20 to-kemu-gold/20'} group-hover:from-kemu-purple/30 group-hover:to-kemu-gold/30 transition-all flex-shrink-0`}>
                    <Icon size={24} className={isDirectorate ? 'text-kemu-gold' : 'text-kemu-purple'} />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-serif font-bold text-kemu-purple leading-tight">
                    {title}
                </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                {description}
            </p>

            {/* Badge for directorates */}
            {isDirectorate && (
                <span className="absolute top-3 right-3 text-xs bg-kemu-gold/20 text-kemu-gold px-2 py-1 rounded-full font-medium">
                    Directorate
                </span>
            )}

            {/* Hover Accent */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-kemu-purple/0 to-kemu-gold/0 group-hover:from-kemu-purple/5 group-hover:to-kemu-gold/5 pointer-events-none transition-all duration-300"></div>
        </div>
    );
};

const SchoolsShowcase: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [schoolsData, directoratesData] = await Promise.all([
                    getSchools(),
                    getDirectorates()
                ]);
                setSchools(schoolsData);
                setDirectorates(directoratesData);
            } catch (err) {
                console.error('Error fetching schools/directorates:', err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Combine schools and directorates for display
    const allItems = [
        ...schools.map(s => ({
            id: `school-${s.id}`,
            title: s.name,
            description: s.overview || 'Offering quality academic programs with a focus on excellence and innovation.',
            icon: getIconForName(s.name),
            isDirectorate: false
        })),
        ...directorates.map(d => ({
            id: `directorate-${d.id}`,
            title: d.name,
            description: d.overview || 'Supporting university operations and academic excellence.',
            icon: getIconForName(d.name),
            isDirectorate: true
        }))
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

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-kemu-purple" />
                        <span className="ml-3 text-gray-600">Loading...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-20 text-red-500">
                        <p>{error}</p>
                    </div>
                )}

                {/* Grid */}
                {!loading && !error && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allItems.map((item, index) => (
                            <SchoolCard
                                key={item.id}
                                icon={item.icon}
                                title={item.title}
                                description={item.description}
                                delay={index * 0.1}
                                isDirectorate={item.isDirectorate}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && allItems.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <Building className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No schools or directorates found.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SchoolsShowcase;
