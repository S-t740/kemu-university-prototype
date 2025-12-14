import React, { useState, useMemo, useEffect } from 'react';
import { Search, GraduationCap, Award, BookOpen, Trophy, X } from 'lucide-react';
import { PageHero, ContentSection } from '../components/common';

/**
 * Programmes Page - Consolidated page with all programme offerings
 * Features filtering by level and search
 */

type ProgrammeLevel = 'All' | 'Certificate' | 'Diploma' | 'Degree' | 'Masters' | 'PhD' | 'TVET';

interface Programme {
    name: string;
    level: ProgrammeLevel;
    duration?: string;
    intake?: string;
    description?: string;
}

const Programmes: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<ProgrammeLevel>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Programme data with descriptions
    const allProgrammes: Programme[] = [
        // Certificate Programmes
        { name: 'Certificate in Church Ministry', level: 'Certificate', duration: '1-2 years', intake: 'Jan, May, Sep', description: 'Equip yourself for effective ministry leadership with this comprehensive programme covering biblical studies, pastoral care, church administration, and practical ministry skills.' },
        { name: 'Certificate in Church Music', level: 'Certificate', duration: '1-2 years', intake: 'Jan, May, Sep', description: 'Develop your musical skills and theological understanding for effective church music ministry, covering worship leadership, choir direction, and music theory.' },
        { name: 'Certificate in Food and Beverage', level: 'Certificate', duration: '1-2 years', intake: 'Jan, May, Sep', description: 'Master the fundamentals of food service and beverage management, including food safety, customer service, and hospitality operations.' },
        { name: 'Certificate in Music and Instrument Operation', level: 'Certificate', duration: '1-2 years', intake: 'Jan, May, Sep', description: 'Learn to play and maintain various musical instruments while developing foundational music theory and performance skills.' },
        { name: 'Certificate in Records and Archives Management', level: 'Certificate', duration: '1-2 years', intake: 'Jan, May, Sep', description: 'Gain essential skills in organizing, preserving, and managing organizational records and archival materials in both physical and digital formats.' },
        { name: 'Certificate in Sign Language', level: 'Certificate', duration: '1-2 years', intake: 'Jan, May, Sep', description: 'Learn effective communication through sign language, promoting inclusivity and accessibility for the deaf and hard-of-hearing community.' },
        { name: 'Certificate in Theology', level: 'Certificate', duration: '1-2 years', intake: 'Jan, May, Sep', description: 'Build a solid foundation in Christian theology, biblical studies, and systematic doctrine for ministry or further theological education.' },

        // Diploma Programmes
        { name: 'Diploma Programmes', level: 'Diploma', duration: '2-3 years', intake: 'Jan, May, Sep', description: 'Explore our diverse range of diploma programmes across various disciplines, designed to provide practical skills and theoretical knowledge for career advancement.' },

        // Masters Programmes
        { name: 'Master of Arts in Counselling Psychology', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Advance your expertise in psychological counseling with rigorous training in therapeutic techniques, mental health assessment, and ethical practice for professional counselors.' },
        { name: 'Master of Arts in Mission Studies', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Deepen your understanding of missiology, cross-cultural ministry, and global Christianity to effectively engage in missions work and church planting.' },
        { name: 'Master of Arts in Religious Studies', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Explore world religions, comparative theology, and religious philosophy while developing critical thinking skills for academic research and interfaith dialogue.' },
        { name: 'Master of Business Administration (MBA)', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Transform your career with advanced business strategy, leadership, finance, and marketing skills. Our MBA programme prepares you for executive roles across industries.' },
        { name: 'Master of Education in Leadership and Education Management', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Become an effective educational leader with expertise in school administration, curriculum development, and strategic planning for educational institutions.' },
        { name: 'Master of Information Science', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Master advanced information management, data analytics, and digital systems to lead in the evolving field of information science and technology.' },
        { name: 'Master of Public Health', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Address critical health challenges with comprehensive training in epidemiology, health policy, disease prevention, and community health management.' },
        { name: 'Master of Science in Agricultural and Rural Development', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Drive sustainable agricultural development and rural transformation through advanced research in crop science, agribusiness, and rural development strategies.' },
        { name: 'Master of Science in Computer Information Systems', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Lead digital transformation initiatives with cutting-edge knowledge in systems analysis, database management, cybersecurity, and IT project management.' },
        { name: 'Master of Science in Finance and Investment', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Excel in financial markets with advanced training in investment analysis, portfolio management, risk assessment, and corporate finance strategies.' },
        { name: 'Master of Science in Health Systems Management', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Lead healthcare organizations effectively with expertise in health policy, hospital administration, quality improvement, and healthcare economics.' },
        { name: 'Master of Science in Hospitality and Tourism Management', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Advance your career in the dynamic hospitality industry with strategic management skills in hotel operations, tourism marketing, and customer experience.' },
        { name: 'Master of Science in Human Nutrition and Dietetics', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Become a nutrition expert with advanced knowledge in clinical nutrition, food science, nutritional biochemistry, and public health nutrition.' },
        { name: 'Master of Science in Nursing Education', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Prepare future nurses with advanced teaching methodologies, curriculum development, and clinical education strategies for nursing schools and healthcare institutions.' },
        { name: 'Masters in International Relations (MIR)', level: 'Masters', duration: '2 years', intake: 'Jan, May, Sep', description: 'Navigate global politics and diplomacy with comprehensive training in international law, foreign policy, conflict resolution, and global governance.' },

        // PhD Programmes
        { name: 'Doctor of Philosophy in Agriculture', level: 'PhD', duration: '3-5 years', intake: 'Jan, May, Sep', description: 'Conduct groundbreaking research in agricultural sciences, contributing to food security, sustainable farming practices, and agricultural innovation.' },
        { name: 'Doctor of Philosophy in Business Administration and Management', level: 'PhD', duration: '3-5 years', intake: 'Jan, May, Sep', description: 'Become a thought leader in business scholarship through rigorous research in organizational behavior, strategic management, and business innovation.' },
        { name: 'Doctor of Philosophy in Counselling Psychology', level: 'PhD', duration: '3-5 years', intake: 'Jan, May, Sep', description: 'Advance the field of counseling psychology through original research in therapeutic interventions, mental health, and psychological assessment methodologies.' },
        { name: 'Doctor of Philosophy in Education Leadership and Management', level: 'PhD', duration: '3-5 years', intake: 'Jan, May, Sep', description: 'Shape the future of education through scholarly research in educational policy, leadership theory, and institutional transformation.' },
        { name: 'Doctor of Philosophy in Health Systems Management', level: 'PhD', duration: '3-5 years', intake: 'Jan, May, Sep', description: 'Drive healthcare innovation through advanced research in health policy, systems optimization, and healthcare delivery models.' },
        { name: 'Doctor of Philosophy in Religious Studies', level: 'PhD', duration: '3-5 years', intake: 'Jan, May, Sep', description: 'Contribute to theological scholarship through in-depth research in systematic theology, biblical studies, church history, or comparative religion.' },

        // TVET Programmes
        { name: 'Diploma in Accountancy (TVET)', level: 'TVET', duration: 'Level 6', intake: 'Rolling', description: 'Gain practical accounting skills including bookkeeping, financial reporting, taxation, and auditing for career opportunities in finance and accounting.' },
        { name: 'Diploma in Business Management (TVET)', level: 'TVET', duration: 'Level 6', intake: 'Rolling', description: 'Develop entrepreneurship and business management skills covering marketing, operations, human resources, and small business administration.' },
        { name: 'Diploma in ICT Technician (TVET)', level: 'TVET', duration: 'Level 6', intake: 'Rolling', description: 'Master IT support, network administration, hardware troubleshooting, and systems maintenance for technical careers in the ICT sector.' },
        { name: 'Craft Certificate in Business Management (TVET)', level: 'TVET', duration: 'Level 5', intake: 'Rolling', description: 'Learn fundamental business skills including basic accounting, customer service, inventory management, and workplace communication.' },
    ];

    // Filter programmes
    const filteredProgrammes = useMemo(() => {
        let filtered = allProgrammes;

        // Filter by level
        if (activeFilter !== 'All') {
            filtered = filtered.filter(p => p.level === activeFilter);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [activeFilter, searchQuery, allProgrammes]);

    const filters: ProgrammeLevel[] = ['All', 'Certificate', 'Diploma', 'Degree', 'Masters', 'PhD', 'TVET'];

    const getLevelIcon = (level: ProgrammeLevel) => {
        switch (level) {
            case 'Certificate': return Award;
            case 'Diploma': return BookOpen;
            case 'Degree': return GraduationCap;
            case 'Masters': return Trophy;
            case 'PhD': return Trophy;
            case 'TVET': return Award;
            default: return GraduationCap;
        }
    };

    const getLevelColor = (level: ProgrammeLevel) => {
        switch (level) {
            case 'Certificate': return 'from-green-500/20 to-green-600/20';
            case 'Diploma': return 'from-blue-500/20 to-blue-600/20';
            case 'Degree': return 'from-kemu-purple/20 to-kemu-blue/20';
            case 'Masters': return 'from-kemu-gold/20 to-yellow-600/20';
            case 'PhD': return 'from-red-500/20 to-pink-600/20';
            case 'TVET': return 'from-teal-500/20 to-cyan-600/20';
            default: return 'from-gray-500/20 to-gray-600/20';
        }
    };

    return (
        <div className="min-h-screen">
            <PageHero
                title="Our Programmes"
                subtitle="Explore our wide range of academic programmes across all levels - from Certificate to PhD"
            />

            <div className="container mx-auto max-w-7xl px-4 py-12">
                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search programmes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 shadow-soft-3d focus:outline-none focus:ring-2 focus:ring-kemu-gold transition-all"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`
                                px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300
                                ${activeFilter === filter
                                    ? 'bg-kemu-purple text-white shadow-deep-3d scale-105'
                                    : 'bg-white/60 text-kemu-purple hover:bg-white/80 hover:scale-105'
                                }
                            `}
                        >
                            {filter} {activeFilter === filter && `(${filteredProgrammes.length})`}
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                <div className="text-center mb-6">
                    <p className="text-gray-600">
                        Showing <strong className="text-kemu-purple">{filteredProgrammes.length}</strong> programme{filteredProgrammes.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Programmes Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProgrammes.map((programme, index) => {
                        const Icon = getLevelIcon(programme.level);
                        const colorClass = getLevelColor(programme.level);

                        return (
                            <div
                                key={index}
                                className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-xl p-6 hover:shadow-deep-3d hover:scale-105 transition-all duration-300 animate-slide-up-fade"
                                style={{ animationDelay: `${(index % 9) * 0.05}s` }}
                            >
                                {/* Icon */}
                                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colorClass} mb-4`}>
                                    <Icon size={24} className="text-kemu-purple" />
                                </div>

                                {/* Programme Name */}
                                <h3 className="text-lg font-bold text-kemu-purple mb-2">
                                    {programme.name}
                                </h3>

                                {/* Level Badge */}
                                <div className="inline-block px-3 py-1 rounded-full bg-kemu-gold/20 text-kemu-gold text-xs font-semibold mb-3">
                                    {programme.level}
                                </div>

                                {/* Details */}
                                {programme.duration && (
                                    <p className="text-sm text-gray-600 mb-1">
                                        <strong>Duration:</strong> {programme.duration}
                                    </p>
                                )}
                                {programme.intake && (
                                    <p className="text-sm text-gray-600 mb-4">
                                        <strong>Intake:</strong> {programme.intake}
                                    </p>
                                )}

                                {/* CTA */}
                                <button
                                    onClick={() => {
                                        setSelectedProgramme(programme);
                                        setIsModalOpen(true);
                                    }}
                                    className="w-full py-2 rounded-lg bg-kemu-purple text-white font-semibold hover:bg-kemu-blue transition-colors"
                                >
                                    Learn More
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* No Results */}
                {filteredProgrammes.length === 0 && (
                    <ContentSection glass className="text-center">
                        <GraduationCap size={64} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-600 mb-2">No programmes found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search query</p>
                    </ContentSection>
                )}

                {/* Application CTA */}
                <ContentSection glass className="mt-12 text-center">
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-kemu-purple mb-4">
                        Ready to Apply?
                    </h3>
                    <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                        Take the next step in your academic journey. Applications are accepted for January, May, and September intakes.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="/#/admissions"
                            className="px-8 py-4 rounded-lg bg-kemu-gold text-white font-bold shadow-deep-3d hover:shadow-glow-gold hover:scale-105 transition-all"
                        >
                            Apply Now
                        </a>
                        <a
                            href="/#/admissions"
                            className="px-8 py-4 rounded-lg bg-white/60 text-kemu-purple font-bold border-2 border-kemu-purple hover:bg-white/80 hover:scale-105 transition-all"
                        >
                            Admissions Info
                        </a>
                    </div>
                </ContentSection>
            </div>

            {/* Programme Details Modal - Old Design Style */}
            {isModalOpen && selectedProgramme && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-4xl max-h-[90vh] bg-gray-50 rounded-lg shadow-2xl animate-scale-in overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Purple Header - matching old design */}
                        <div className="bg-kemu-purple text-white py-8 px-8">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={24} />
                            </button>

                            <span className="block text-kemu-gold font-bold tracking-wide uppercase text-sm mb-2">
                                {selectedProgramme.level}
                            </span>
                            <h2 className="text-2xl md:text-4xl font-serif font-bold mb-4">
                                {selectedProgramme.name}
                            </h2>
                            <div className="flex flex-wrap gap-6 text-white/90">
                                {selectedProgramme.duration && (
                                    <div className="flex items-center">
                                        <span className="mr-2 text-kemu-gold">⏱</span>
                                        <span>{selectedProgramme.duration}</span>
                                    </div>
                                )}
                                {selectedProgramme.intake && (
                                    <div className="flex items-center">
                                        <span className="mr-2 text-kemu-gold">📅</span>
                                        <span>Intake: {selectedProgramme.intake}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Area - matching old design */}
                        <div className="p-8 grid md:grid-cols-3 gap-8 overflow-y-auto max-h-[50vh]">
                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Programme Overview</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {selectedProgramme.description || 'Comprehensive programme designed to equip you with essential knowledge and skills for your chosen field.'}
                                    </p>
                                    <p className="mt-4 text-gray-700 leading-relaxed">
                                        Kenya Methodist University is committed to providing market-driven courses with strong industry linkages and opportunities outside the classroom. Our programmes are designed to provide positive career outcomes for students in their chosen fields.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Requirements</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        <li>Minimum entry requirements as per programme level</li>
                                        <li>Subject specific requirements apply</li>
                                        <li>Contact Admissions Office for detailed requirements</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="md:col-span-1">
                                <div className="bg-white p-6 rounded-lg shadow-lg sticky top-0">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Admissions</h3>
                                    <div className="space-y-4 mb-6">
                                        <div className="bg-gray-50 p-4 rounded border border-gray-100">
                                            <p className="text-sm text-gray-500 mb-1">Next Intake</p>
                                            <p className="font-bold text-kemu-purple">September 2025</p>
                                            <p className="text-xs text-gray-400 mt-1">Trimester 3, 2025</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded border border-gray-100">
                                            <p className="text-sm text-gray-500 mb-1">Intakes Available</p>
                                            <p className="font-bold text-kemu-purple">{selectedProgramme.intake || 'Jan, May, Sep'}</p>
                                        </div>
                                    </div>
                                    <a
                                        href="/#/admissions"
                                        className="block w-full text-center bg-kemu-gold hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded transition-colors mb-3"
                                    >
                                        Apply Now
                                    </a>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="block w-full text-center border-2 border-kemu-blue text-kemu-blue hover:bg-kemu-blue hover:text-white font-bold py-3 px-4 rounded transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Programmes;
