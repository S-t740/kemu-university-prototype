import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, Building2, ArrowRight, Loader2, Search, Sparkles, CheckCircle, Users, Award, ChevronDown, ChevronUp, FileText, X } from 'lucide-react';
import { getVacancies } from '../../services/api';
import { Vacancy } from '../../types';
import Modal from '../../components/Modal';

/**
 * TVET Careers Page - Shows TVET-specific job opportunities with job details view
 */

const TVETCareers: React.FC = () => {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                setLoading(true);
                const data = await getVacancies({ institution: 'TVET' });
                setVacancies(data);
            } catch (err) {
                setError('Failed to load vacancies');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVacancies();
    }, []);

    const filteredVacancies = vacancies.filter((vacancy) =>
        vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vacancy.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const employabilityFeatures = [
        { icon: CheckCircle, title: 'Hands-on Training', description: 'Practical skills for immediate employment' },
        { icon: Users, title: 'Industry Partnerships', description: 'Connections with leading employers' },
        { icon: Award, title: 'Certified Skills', description: 'TVETA recognized qualifications' },
        { icon: Briefcase, title: 'Career Support', description: 'Job placement assistance' },
    ];

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-kemu-purple10/30">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-br from-kemu-purple via-kemu-blue to-kemu-purple overflow-hidden">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-sm mb-4">
                            <Sparkles size={16} className="text-kemu-gold" />
                            <span>KeMU TVET Institute</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Careers & Opportunities</h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Join our team or discover how TVET training prepares you for career success.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Employability Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-serif font-bold text-kemu-purple mb-6 text-center">
                        Why TVET Graduates Are in Demand
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {employabilityFeatures.map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-soft-3d hover:shadow-deep-3d transition-all text-center">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-kemu-purple10 flex items-center justify-center">
                                    <feature.icon className="text-kemu-purple" size={28} />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Current Openings */}
                <div className="bg-white rounded-xl shadow-soft-3d p-8 mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h2 className="text-2xl font-serif font-bold text-kemu-purple">
                            Current Openings at TVET Institute
                        </h2>
                        <div className="relative max-w-xs w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search positions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-200 focus:border-kemu-purple focus:ring-2 focus:ring-kemu-purple/20 outline-none"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="animate-spin text-kemu-purple" size={40} />
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : filteredVacancies.length === 0 ? (
                        <div className="text-center py-16">
                            <Briefcase className="mx-auto text-gray-300 mb-4" size={64} />
                            <p className="text-gray-500 mb-2">No open positions at the moment.</p>
                            <p className="text-sm text-gray-400">Check back later or explore general KeMU opportunities.</p>
                            <Link
                                to="/careers"
                                className="inline-flex items-center gap-2 mt-4 text-kemu-purple font-medium hover:text-kemu-gold transition-colors"
                            >
                                View All KeMU Careers
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredVacancies.map((vacancy) => (
                                <div
                                    key={vacancy.id}
                                    className={`border rounded-xl overflow-hidden transition-all ${expandedId === vacancy.id ? 'border-kemu-purple shadow-soft-3d' : 'border-gray-100 hover:border-kemu-purple/30'}`}
                                >
                                    {/* Job Header - Always Visible */}
                                    <div className="p-6 group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <button
                                                    onClick={() => toggleExpand(vacancy.id)}
                                                    className="text-left w-full"
                                                >
                                                    <h3 className="text-lg font-serif font-bold text-gray-800 group-hover:text-kemu-purple transition-colors mb-2 flex items-center gap-2">
                                                        {vacancy.title}
                                                        {expandedId === vacancy.id ? (
                                                            <ChevronUp size={18} className="text-kemu-purple" />
                                                        ) : (
                                                            <ChevronDown size={18} className="text-gray-400" />
                                                        )}
                                                    </h3>
                                                </button>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Building2 size={14} />
                                                        {vacancy.department}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        {vacancy.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        Deadline: {new Date(vacancy.deadline).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleExpand(vacancy.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-kemu-purple text-kemu-purple rounded-lg font-medium hover:bg-kemu-purple10 transition-colors"
                                                >
                                                    <FileText size={16} />
                                                    {expandedId === vacancy.id ? 'Hide Details' : 'View Details'}
                                                </button>
                                                <Link
                                                    to={`/tvet/apply/${vacancy.slug}`}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-kemu-gold text-white rounded-lg font-medium hover:bg-kemu-gold/90 transition-colors"
                                                >
                                                    Apply
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Details - Expandable */}
                                    {expandedId === vacancy.id && (
                                        <div className="px-6 pb-6 pt-0 border-t border-gray-100 bg-gray-50/50 animate-fade-up">
                                            <div className="grid md:grid-cols-2 gap-6 pt-6">
                                                {/* Description */}
                                                <div>
                                                    <h4 className="font-bold text-kemu-purple mb-3 flex items-center gap-2">
                                                        <FileText size={18} />
                                                        Job Description
                                                    </h4>
                                                    <div className="prose prose-sm text-gray-700 whitespace-pre-wrap">
                                                        {vacancy.description || 'No description provided.'}
                                                    </div>
                                                </div>

                                                {/* Requirements */}
                                                <div>
                                                    <h4 className="font-bold text-kemu-purple mb-3 flex items-center gap-2">
                                                        <CheckCircle size={18} />
                                                        Requirements
                                                    </h4>
                                                    <div className="prose prose-sm text-gray-700 whitespace-pre-wrap">
                                                        {vacancy.requirements || 'No requirements specified.'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Job Info Summary */}
                                            <div className="mt-6 flex flex-wrap gap-4 p-4 bg-white rounded-lg border border-gray-200">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Type:</span>
                                                    <span className="font-semibold text-gray-800">{vacancy.type || 'Not specified'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Location:</span>
                                                    <span className="font-semibold text-gray-800">{vacancy.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Deadline:</span>
                                                    <span className="font-semibold text-red-600">{new Date(vacancy.deadline).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {/* Apply CTA */}
                                            <div className="mt-6 flex justify-center">
                                                <Link
                                                    to={`/tvet/apply/${vacancy.slug}`}
                                                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-kemu-purple to-kemu-blue text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-md"
                                                >
                                                    Apply for This Position
                                                    <ArrowRight size={18} />
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-kemu-purple to-kemu-blue rounded-xl shadow-deep-3d p-8 text-white text-center">
                    <h2 className="text-2xl font-serif font-bold mb-4">Interested in TVET Training?</h2>
                    <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                        Equip yourself with industry-ready skills. Join KeMU TVET Institute and start your career journey today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/tvet/programs"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-kemu-purple rounded-xl font-semibold hover:bg-white/90 transition-colors"
                        >
                            Explore Programs
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            to="/tvet/admissions"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-kemu-gold text-white rounded-xl font-semibold hover:bg-kemu-gold/90 transition-colors"
                        >
                            Apply Now
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TVETCareers;
