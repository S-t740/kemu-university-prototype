import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, History, Target, Heart, Building, GraduationCap } from 'lucide-react';
import { PageHero, TabSection, ContentSection, Tab } from '../components/common';
import GlassSection from '../components/GlassSection';
import StudentSidebar from '../components/students/StudentSidebar';
import StudentContent from '../components/students/StudentContent';

/**
 * About Page - Consolidated page with all about-related content
 * Tabs: About KeMU, Our History, Vision & Mission, Core Values
 */

const About: React.FC = () => {
    const tabs: Tab[] = [
        {
            id: 'about',
            label: 'About KeMU',
            icon: BookOpen,
            content: <AboutKeMUContent />
        },
        {
            id: 'history',
            label: 'Our History',
            icon: History,
            content: <HistoryContent />
        },
        {
            id: 'vision',
            label: 'Vision & Mission',
            icon: Target,
            content: <VisionMissionContent />
        },
        {
            id: 'governance',
            label: 'Governance',
            icon: Building,
            content: <GovernanceContent />
        },
        {
            id: 'values',
            label: 'Core Values',
            icon: Heart,
            content: <CoreValuesContent />
        },
        {
            id: 'students',
            label: 'Student Services',
            icon: GraduationCap,
            content: <StudentServicesContent />
        }
    ];

    // Handle deep linking via hash
    const location = useLocation();
    const [currentTab, setCurrentTab] = useState(tabs[0].id);

    useEffect(() => {
        if (location.hash) {
            const hash = location.hash.replace('#', '');
            // Check if hash matches a tab id
            const matchingTab = tabs.find(t => t.id === hash);
            if (matchingTab) {
                setCurrentTab(matchingTab.id);
            }
        }
    }, [location]);

    return (
        <div className="min-h-screen">
            <PageHero
                title="About Kenya Methodist University"
                subtitle="A Chartered Christian University producing the next generation of professional and transformational leaders"
            />

            <div className="container mx-auto max-w-6xl px-4 py-12">
                <TabSection
                    tabs={tabs}
                    activeTabId={currentTab}
                    onTabChange={setCurrentTab}
                />
            </div>
        </div>
    );
};

// About KeMU Tab Content
const AboutKeMUContent: React.FC = () => {
    return (
        <div className="space-y-8">
            <ContentSection glass>
                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                        Kenya Methodist University is a <strong className="text-kemu-purple">Chartered Christian University</strong> with our main campus in Meru and additional campuses in Nairobi and Mombasa. We offer PhD, Masters, Degree, Diploma, and Certificate programmes across a wide range of disciplines.
                    </p>

                    <p className="text-gray-700 leading-relaxed text-lg">
                        KeMU has over <strong className="text-kemu-gold">32,000 alumni</strong> and is the <strong className="text-kemu-purple">first and only private university in Kenya to graduate medical doctors</strong>.
                    </p>

                    <p className="text-gray-700 leading-relaxed text-lg">
                        The university focuses on <strong>market-driven courses</strong>, strong <strong>industry linkages</strong>, and comprehensive <strong>opportunities outside the classroom</strong> for holistic student development.
                    </p>
                </div>
            </ContentSection>

            {/* Key Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                <GlassSection className="text-center">
                    <div className="text-4xl font-bold text-kemu-purple mb-2">32,000+</div>
                    <div className="text-sm text-gray-600">Alumni Worldwide</div>
                </GlassSection>
                <GlassSection className="text-center">
                    <div className="text-4xl font-bold text-kemu-gold mb-2">3</div>
                    <div className="text-sm text-gray-600">Campuses</div>
                </GlassSection>
                <GlassSection className="text-center">
                    <div className="text-4xl font-bold text-kemu-blue mb-2">1st</div>
                    <div className="text-sm text-gray-600">Private University to Graduate Doctors</div>
                </GlassSection>
            </div>
        </div>
    );
};

// History Tab Content
const HistoryContent: React.FC = () => {
    const timeline = [
        { year: '1984', event: 'Methodist Church in Kenya decides to establish a university in Kaaga, Meru' },
        { year: '1987', event: 'Committee formed to develop university modalities' },
        { year: '1995', event: 'CHE (Commission for Higher Education) inspection visit' },
        { year: 'June 1997', event: 'Letter of Interim Authority granted by CHE' },
        { year: 'June 2006', event: 'Chartered as a university by President Mwai Kibaki' }
    ];

    return (
        <ContentSection glass>
            <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                    Kenya Methodist University (KeMU) is a Christian chartered private university founded by the <strong className="text-kemu-purple">Methodist Church in Kenya (MCK)</strong>.
                </p>

                <p className="text-gray-700 leading-relaxed text-lg">
                    The Church first established the <strong>Kaaga Rural Training Centre</strong> for agricultural training, then the <strong>Methodist Training Institute (MTI)</strong> for training ministers. This foundation laid the groundwork for establishing a comprehensive university.
                </p>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
                <h3 className="text-2xl font-serif font-bold text-kemu-blue mb-4">Our Journey</h3>
                <div className="relative border-l-2 border-kemu-gold pl-8 ml-4 space-y-8">
                    {timeline.map((item, index) => (
                        <div key={index} className="relative animate-slide-up-fade" style={{ animationDelay: `${index * 0.1}s` }}>
                            {/* Timeline dot */}
                            <div className="absolute -left-[42px] top-1 w-4 h-4 rounded-full bg-kemu-gold border-4 border-white"></div>

                            {/* Content */}
                            <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4">
                                <div className="text-xl font-bold text-kemu-purple mb-2">{item.year}</div>
                                <div className="text-gray-700">{item.event}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ContentSection>
    );
};

// Vision & Mission Tab Content
const VisionMissionContent: React.FC = () => {
    return (
        <div className="space-y-6">
            <GlassSection>
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-kemu-purple/20 to-kemu-gold/20">
                        <Target size={28} className="text-kemu-purple" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-kemu-purple mb-3">Our Vision</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            A <strong>globally competitive Christian University</strong> producing the next generation of <strong>professional and transformational leaders</strong>.
                        </p>
                    </div>
                </div>
            </GlassSection>

            <GlassSection>
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-kemu-blue/20 to-kemu-purple/20">
                        <BookOpen size={28} className="text-kemu-blue" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-kemu-blue mb-3">Our Mission</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            To provide <strong>quality education and training</strong> that produces <strong>professionally competent men and women of integrity</strong> who are spiritually well nurtured and socially responsible.
                        </p>
                    </div>
                </div>
            </GlassSection>

            <GlassSection>
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-kemu-gold/20 to-kemu-blue/20">
                        <Heart size={28} className="text-kemu-gold" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-kemu-gold mb-3">Our Motto</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            <span className="italic font-semibold">"Laborare Est Orare"</span>
                            <br />
                            <span className="text-base text-gray-600">(Translation from Latin to English: "To Work is to Pray", Swahili: "Kazi ni Sala")</span>
                        </p>
                    </div>
                </div>
            </GlassSection>

            <GlassSection>
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-kemu-purple/20 to-kemu-gold/20">
                        <Target size={28} className="text-kemu-purple" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-kemu-purple mb-3">Our Slogan</h3>
                        <p className="text-lg text-gray-700 leading-relaxed italic font-semibold">
                            "The Future is Here"
                        </p>
                    </div>
                </div>
            </GlassSection>
        </div>
    );
};

// Governance Tab Content
const GovernanceContent: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Introduction */}
            <ContentSection glass>
                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                        Kenya Methodist University's <strong className="text-kemu-purple">governance structure</strong> ensures proper oversight and management of the university's operations and academic affairs through various bodies including the Board of Trustees, University Council, and University Management.
                    </p>
                </div>
            </ContentSection>

            {/* Board of Trustees */}
            <GlassSection>
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-kemu-purple/20 to-kemu-gold/20">
                        <Building size={28} className="text-kemu-purple" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-kemu-purple mb-3">Board of Trustees</h3>
                        <p className="text-gray-700 mb-4">
                            Constituted under the Trustees Act Cap. 167 of 2009 and University Charter, the Board includes sponsor representatives and various professionals.
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm"><strong className="text-kemu-gold">Chairman:</strong> Rev. Dr. Samuel Kobia</p>
                            <p className="text-sm text-gray-600">
                                <strong>Members:</strong> Justice (Rtd) Aaron Ringera, Mr. George Mutwiri, Rev. Dr. Nicholas Mutwiri, Mrs. Gladys Mugambi, Prof. Sheila Ryanga, Mr. Gitonga Muriuki, Hon. Linah Jebii Kilimo, Mr. Jonson Dima, Mr. Samuel Kaumbuthu, Hon. Charity K. Chepkwony
                            </p>
                        </div>
                    </div>
                </div>
            </GlassSection>

            {/* University Council */}
            <GlassSection>
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-kemu-blue/20 to-kemu-purple/20">
                        <Building size={28} className="text-kemu-blue" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-kemu-blue mb-3">University Council</h3>
                        <p className="text-gray-700 mb-4">
                            The governing body appointed by the Board of Trustees, responsible for policy and strategic direction.
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm"><strong className="text-kemu-gold">Chairperson:</strong> Rev. Dr. Catherine Mutua</p>
                            <p className="text-sm"><strong className="text-kemu-gold">Secretary:</strong> Rev. Prof. John Kobia Ataya (Vice-Chancellor)</p>
                            <p className="text-sm text-gray-600">
                                <strong>Members:</strong> Mr. Francis Njogu, Ms. Qabale Duba (HSC), Mr. Musa Chepkurui, Mr. Zablon Nyale, Dr. Isaac Kaberia, Mr. Henry Kurauka, Mr. Philip Maobe, Rev. Prof. Joseph Galgalo, Rtd. Justice Aaron Ringera, Ms. Jenu John, Hon. Rachael Amolo, Mr. George Mutwiri, Mr. John Mati Lautani
                            </p>
                        </div>
                    </div>
                </div>
            </GlassSection>

            {/* Chancellor and Vice-Chancellor */}
            <div className="grid md:grid-cols-2 gap-6">
                <GlassSection>
                    <h3 className="text-xl font-bold text-kemu-purple mb-3">University Chancellor</h3>
                    <p className="text-gray-700 text-sm mb-2">
                        The <strong>titular head</strong> of the University who confers degrees, grants diplomas, certificates and other awards.
                    </p>
                    <p className="text-sm">
                        <strong className="text-kemu-gold">Current Chancellor:</strong><br />
                        Rev. Isiah Deye<br />
                        <span className="text-gray-600">Presiding Bishop, Methodist Church in Kenya</span>
                    </p>
                </GlassSection>

                <GlassSection>
                    <h3 className="text-xl font-bold text-kemu-blue mb-3">Vice-Chancellor</h3>
                    <p className="text-gray-700 text-sm mb-2">
                        The <strong>Chief Executive</strong> and academic/administrative head of the University.
                    </p>
                    <p className="text-sm">
                        <strong className="text-kemu-gold">Current Vice-Chancellor:</strong><br />
                        Rev. Prof. John Kobia Ataya, Ph.D<br />
                        <span className="text-gray-600">Chair of University Management Board</span>
                    </p>
                </GlassSection>
            </div>

            {/* Senate and Management */}
            <GlassSection>
                <h3 className="text-2xl font-serif font-bold text-kemu-purple mb-3">University Senate</h3>
                <p className="text-gray-700 mb-3">
                    The academic governing body chaired by the Vice-Chancellor, responsible for academic standards, course content, admission regulations, and degree awards.
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Composition:</strong> Vice-Chancellor (Chairman), Deputy Vice-Chancellors, Principals, Deans, Department Chairmen, Librarian, Faculty representatives, Professors, and Student representatives
                </p>
            </GlassSection>

            {/* University Management Board */}
            <GlassSection>
                <h3 className="text-2xl font-serif font-bold text-kemu-blue mb-4">University Management Board</h3>
                <p className="text-gray-700 mb-4">The executive team responsible for day-to-day operations and strategic implementation.</p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4">
                        <p className="text-sm font-semibold text-kemu-purple">Rev. Prof. John Kobia Ataya, Ph.D</p>
                        <p className="text-xs text-gray-600">Vice-Chancellor & Chair</p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4">
                        <p className="text-sm font-semibold text-kemu-purple">Dr. Eliab Seroney Some, Ph.D</p>
                        <p className="text-xs text-gray-600">DVC, Administration, Planning & Finance</p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4">
                        <p className="text-sm font-semibold text-kemu-purple">Dr. Mwiti Evans, Ph.D</p>
                        <p className="text-xs text-gray-600">DVC, Academic & Student Affairs</p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4">
                        <p className="text-sm font-semibold text-kemu-purple">Dr. Lucy Kanyiri Ikiara, Ph.D</p>
                        <p className="text-xs text-gray-600">Registrar (Academic Affairs)</p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4">
                        <p className="text-sm font-semibold text-kemu-purple">Prof. Paul Maku Gichohi, Ph.D</p>
                        <p className="text-xs text-gray-600">University Librarian</p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4">
                        <p className="text-sm font-semibold text-kemu-purple">Dr. Stephen Laititi Mutunga, Ph.D</p>
                        <p className="text-xs text-gray-600">Registrar (Administration, Planning & Development)</p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4">
                        <p className="text-sm font-semibold text-kemu-purple">Mr. Humphrey Mwenda Murugu</p>
                        <p className="text-xs text-gray-600">Chief Financial Officer</p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4">
                        <p className="text-sm font-semibold text-kemu-purple">Mbugua Njeri, LL.B</p>
                        <p className="text-xs text-gray-600">Legal Officer</p>
                    </div>
                </div>
            </GlassSection>
        </div>
    );
};

// Core Values Tab Content
const CoreValuesContent: React.FC = () => {
    const values = [
        {
            title: 'Moral Values',
            description: 'We uphold high moral standards and ethical conduct in all our activities'
        },
        {
            title: 'Academic Excellence',
            description: 'We are committed to maintaining the highest standards of teaching, learning, and research'
        },
        {
            title: 'Professional Competence',
            description: 'We produce graduates who are professionally competent and ready for the workforce'
        },
        {
            title: 'Spiritual Nurture',
            description: 'We nurture students spiritually as part of our Christian foundation'
        },
        {
            title: 'Social Responsibility',
            description: 'We develop graduates who are socially responsible and agents of positive change'
        },
        {
            title: 'Integrity',
            description: 'We uphold integrity in all our dealings and expect the same from our community'
        }
    ];

    return (
        <ContentSection glass>
            <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                    The Guide to KeMU values is intended to guide staff, students, and all friends of the university in respect to <strong>moral, academic, professional and social values</strong> appropriate to Kenya Methodist University.
                </p>

                <p className="text-gray-700 leading-relaxed text-lg">
                    The embodiment of these values by the KeMU community is in-keeping with the sponsor's vision to found a Christian university that produces <strong>professionally competent men and women of integrity</strong> who are spiritually well nurtured and socially responsible.
                </p>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
                {values.map((value, index) => (
                    <div
                        key={index}
                        className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-6 hover:shadow-deep-3d hover:scale-105 transition-all duration-300 animate-slide-up-fade"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <h4 className="text-lg font-bold text-kemu-purple mb-2">{value.title}</h4>
                        <p className="text-gray-700">{value.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-kemu-purple/10 to-kemu-gold/10 rounded-xl border border-kemu-gold/30">
                <p className="text-center text-gray-700 italic">
                    "Graduates who are spiritually well nurtured and professionally competent are the <strong className="text-kemu-purple">salt and the light of the world</strong> and effective agents of transforming the world."
                </p>
            </div>
        </ContentSection>
    );
};

export default About;

// Student Services Tab Content
const StudentServicesContent: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('welfare');
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/student-services');
                if (response.ok) {
                    const data = await response.json();
                    setServices(data);
                }
            } catch (error) {
                console.error('Failed to fetch student services:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleCategoryChange = (id: string) => {
        setActiveCategory(id);
        // Scroll to content on mobile
        const contentTop = document.getElementById('student-content-start');
        if (contentTop && window.innerWidth < 768) {
            contentTop.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
            {/* Sidebar Navigation */}
            <aside className="md:w-64 flex-shrink-0">
                <div className="sticky top-24">
                    <StudentSidebar
                        categories={services}
                        activeCategory={activeCategory}
                        onSelectCategory={handleCategoryChange}
                        loading={loading}
                    />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1" id="student-content-start">
                <div className="bg-white rounded-xl md:p-6 border border-gray-100 shadow-sm">
                    <StudentContent
                        activeCategory={activeCategory}
                        services={services}
                        loading={loading}
                    />
                </div>
            </main>
        </div>
    );
};
