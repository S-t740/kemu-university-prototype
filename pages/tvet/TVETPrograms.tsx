import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { getPrograms } from '../../services/api';
import { Program } from '../../types';

/**
 * TVET Programs Page - Shows all TVET Institute programs
 */

const TVETPrograms: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('All');

    const levels = ['All', 'Diploma', 'Certificate'];

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                setLoading(true);
                const data = await getPrograms(undefined, undefined, 'TVET');
                setPrograms(data);
            } catch (err) {
                setError('Failed to load programs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    // Filter programs
    const filteredPrograms = programs.filter((program) => {
        const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = selectedLevel === 'All' || program.degreeType === selectedLevel;
        return matchesSearch && matchesLevel;
    });

    // Group programs by degree type
    const groupedPrograms = filteredPrograms.reduce((acc, program) => {
        const type = program.degreeType || 'Other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(program);
        return acc;
    }, {} as Record<string, Program[]>);

    // Define display order
    const typeOrder = ['Diploma', 'Certificate'];
    const sortedTypes = Object.keys(groupedPrograms).sort((a, b) => {
        const indexA = typeOrder.indexOf(a);
        const indexB = typeOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return (
        <div className="min-h-screen bg-kemu-purple10/30">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-br from-kemu-purple via-kemu-blue to-kemu-purple overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat"></div>
                </div>
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center text-white">
                        <p className="text-kemu-gold font-medium mb-2">KeMU TVET Institute</p>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Programs</h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Industry-focused programs designed to equip you with practical skills for immediate employment.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-xl shadow-soft-3d py-4 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search programs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-kemu-purple focus:ring-2 focus:ring-kemu-purple/20 outline-none transition-all"
                            />
                        </div>

                        {/* Level Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-gray-500" />
                            <div className="flex gap-2">
                                {levels.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setSelectedLevel(level)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedLevel === level
                                                ? 'bg-kemu-purple text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="animate-spin text-kemu-purple" size={48} />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : filteredPrograms.length === 0 ? (
                        <div className="text-center py-20">
                            <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
                            <p className="text-gray-500">No programs found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {sortedTypes.map((type) => (
                                <div key={type}>
                                    <h2 className="text-2xl font-serif font-bold text-kemu-purple mb-6 flex items-center gap-2">
                                        <GraduationCap className="text-kemu-gold" />
                                        {type} Programs
                                        <span className="text-sm font-normal text-gray-500 ml-2">
                                            ({groupedPrograms[type].length})
                                        </span>
                                    </h2>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {groupedPrograms[type].map((program) => (
                                            <div
                                                key={program.id}
                                                className="bg-white rounded-xl p-6 shadow-soft-3d hover:shadow-deep-3d hover:-translate-y-1 transition-all group"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-kemu-purple10 text-kemu-purple">
                                                        {program.degreeType}
                                                    </span>
                                                    {program.duration && (
                                                        <span className="flex items-center gap-1 text-sm text-gray-500">
                                                            <Clock size={14} />
                                                            {program.duration}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-serif font-bold text-gray-800 mb-2 group-hover:text-kemu-purple transition-colors">
                                                    {program.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                                    {program.overview || 'Competence Based Education & Training program'}
                                                </p>
                                                <Link
                                                    to={`/programs/${program.slug}`}
                                                    className="inline-flex items-center gap-1 text-kemu-gold font-medium text-sm hover:gap-2 transition-all"
                                                >
                                                    Learn More
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-to-r from-kemu-purple to-kemu-blue">
                <div className="container mx-auto max-w-4xl text-center text-white">
                    <h2 className="text-3xl font-serif font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-white/80 mb-8">
                        Join KeMU TVET Institute and gain industry-ready skills. Intakes: January, May, September.
                    </p>
                    <Link
                        to="/tvet/admissions"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-kemu-gold text-white rounded-xl font-semibold text-lg shadow-deep-3d hover:shadow-glow-gold hover:scale-105 transition-all"
                    >
                        Apply Now
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default TVETPrograms;
