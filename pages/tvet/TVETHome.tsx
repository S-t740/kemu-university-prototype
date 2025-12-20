import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Briefcase, Users, GraduationCap, CheckCircle, Sparkles, Calendar, Newspaper, MapPin, Clock } from 'lucide-react';
import { getNews, getEvents } from '../../services/api';
import { NewsItem, EventItem } from '../../types';
import { formatDate } from '../../utils';

/**
 * TVET Home Page - Landing page for KeMU TVET Institute
 */

const TVETHome: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newsData, eventsData] = await Promise.all([
                    getNews({ institution: 'TVET' }),
                    getEvents({ institution: 'TVET' })
                ]);
                setNews(newsData.slice(0, 3));
                setEvents(eventsData.slice(0, 3));
            } catch (error) {
                console.error('Error fetching news/events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const highlights = [
        { icon: Award, label: 'TVETA Licensed', value: '✓' },
        { icon: BookOpen, label: 'Programs', value: '39+' },
        { icon: Users, label: 'Students', value: '2000+' },
        { icon: Briefcase, label: 'Employability', value: '95%' },
    ];

    const programCategories = [
        { title: 'Diploma (Level 6)', count: 17, description: '2-year professional programs' },
        { title: 'Craft Certificate (Level 5)', count: 11, description: '1-year technical programs' },
        { title: 'Artisan (Level 4)', count: 1, description: 'Entry-level practical training' },
        { title: 'Short Courses', count: 10, description: 'Professional development' },
    ];

    const features = [
        'Competence Based Education & Training (CBET)',
        'Industry-relevant practical skills',
        'Modern training facilities',
        'Experienced instructors',
        'Flexible learning schedules',
        'Credit transfer & exemptions',
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-kemu-purple via-kemu-blue to-kemu-purple">
                    <div className="absolute inset-0 bg-[url('/kemu-university.jpg')] bg-cover bg-center opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center space-y-8 animate-fade-up">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-sm">
                            <Sparkles size={16} className="text-kemu-gold" />
                            <span>TVETA Licensed Institute</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight text-white drop-shadow-lg">
                            <span className="text-white">KeMU TVET</span>
                            <br />
                            <span className="text-kemu-gold drop-shadow-[0_2px_10px_rgba(160,103,46,0.5)]">Institute</span>
                        </h1>

                        {/* Motto */}
                        <p className="text-xl md:text-2xl text-white/90 italic font-serif">
                            "Dreams are still valid."
                        </p>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                            A centre of excellence in Competence Based Education and Training, providing holistic nurturing to inspire innovation and self-reliance.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Link
                                to="/tvet/programs"
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-kemu-gold text-white rounded-xl font-semibold text-lg shadow-deep-3d hover:shadow-glow-gold hover:scale-105 transition-all duration-300"
                            >
                                <span>Explore Programs</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/tvet/admissions"
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-kemu-purple hover:scale-105 transition-all duration-300"
                            >
                                <span>Apply Now</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent pointer-events-none"></div>
            </section>

            {/* Stats Strip */}
            <section className="relative z-20 -mt-12 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-deep-3d p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {highlights.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-kemu-purple10 flex items-center justify-center">
                                    <stat.icon className="text-kemu-purple" size={24} />
                                </div>
                                <p className="text-2xl font-bold text-kemu-purple">{stat.value}</p>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Vision */}
                        <div className="bg-gradient-to-br from-kemu-purple to-kemu-blue rounded-2xl p-8 text-white shadow-deep-3d">
                            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                                <GraduationCap className="text-kemu-gold" />
                                Our Vision
                            </h2>
                            <p className="text-white/90 leading-relaxed">
                                A centre of excellence in Competence Based Education and Training providing holistic nurturing to inspire innovation and self-reliance.
                            </p>
                        </div>

                        {/* Mission */}
                        <div className="bg-gradient-to-br from-kemu-blue to-kemu-purple rounded-2xl p-8 text-white shadow-deep-3d">
                            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                                <Award className="text-kemu-gold" />
                                Our Mission
                            </h2>
                            <p className="text-white/90 leading-relaxed">
                                Provide quality competency-based education and training that recognizes and nurtures the potential of each learner towards achieving higher standards of excellence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Program Categories */}
            <section className="py-16 px-4 bg-kemu-purple10/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-kemu-purple mb-4">Our Programs</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Industry-focused programs designed to equip you with practical skills for immediate employment.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {programCategories.map((cat, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-soft-3d hover:shadow-deep-3d hover:-translate-y-1 transition-all">
                                <div className="text-4xl font-bold text-kemu-gold mb-2">{cat.count}</div>
                                <h3 className="text-lg font-serif font-bold text-kemu-purple mb-2">{cat.title}</h3>
                                <p className="text-sm text-gray-600">{cat.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link
                            to="/tvet/programs"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-kemu-purple text-white rounded-xl font-semibold hover:bg-kemu-purple/90 transition-colors"
                        >
                            View All Programs
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* News & Events Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* News */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-serif font-bold text-kemu-purple flex items-center gap-2">
                                    <Newspaper className="text-kemu-gold" size={28} />
                                    Latest News
                                </h2>
                            </div>
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-gray-100 rounded-xl h-24 animate-pulse" />
                                    ))}
                                </div>
                            ) : news.length > 0 ? (
                                <div className="space-y-4">
                                    {news.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`/news/${item.slug}`}
                                            className="block bg-white rounded-xl p-5 shadow-soft-3d hover:shadow-deep-3d hover:-translate-y-1 transition-all group"
                                        >
                                            <h3 className="font-semibold text-gray-800 group-hover:text-kemu-purple transition-colors mb-2 line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <Clock size={14} />
                                                {formatDate(item.publishedAt)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-kemu-purple10/50 rounded-xl p-8 text-center">
                                    <Newspaper className="mx-auto text-kemu-purple/30 mb-3" size={40} />
                                    <p className="text-gray-500">No news articles yet.</p>
                                    <p className="text-sm text-gray-400 mt-1">Check back soon for updates!</p>
                                </div>
                            )}
                        </div>

                        {/* Events */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-serif font-bold text-kemu-purple flex items-center gap-2">
                                    <Calendar className="text-kemu-gold" size={28} />
                                    Upcoming Events
                                </h2>
                            </div>
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-gray-100 rounded-xl h-24 animate-pulse" />
                                    ))}
                                </div>
                            ) : events.length > 0 ? (
                                <div className="space-y-4">
                                    {events.map((event) => (
                                        <div
                                            key={event.id}
                                            className="bg-white rounded-xl p-5 shadow-soft-3d hover:shadow-deep-3d transition-all"
                                        >
                                            <div className="flex gap-4">
                                                <div className="bg-kemu-gold text-white rounded-lg p-3 text-center min-w-[60px]">
                                                    <div className="text-2xl font-bold">
                                                        {new Date(event.date).getDate()}
                                                    </div>
                                                    <div className="text-xs uppercase">
                                                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        {event.venue}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-kemu-purple10/50 rounded-xl p-8 text-center">
                                    <Calendar className="mx-auto text-kemu-purple/30 mb-3" size={40} />
                                    <p className="text-gray-500">No upcoming events.</p>
                                    <p className="text-sm text-gray-400 mt-1">Stay tuned for announcements!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why TVET */}
            <section className="py-16 px-4 bg-kemu-purple10/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-kemu-purple mb-6">
                                Why Choose KeMU TVET?
                            </h2>
                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle className="text-kemu-gold flex-shrink-0 mt-1" size={20} />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <Link
                                    to="/tvet/about"
                                    className="inline-flex items-center gap-2 text-kemu-purple font-semibold hover:text-kemu-gold transition-colors"
                                >
                                    Learn more about us
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-kemu-gold/20 to-kemu-purple/20 rounded-2xl p-8">
                            <h3 className="text-xl font-serif font-bold text-kemu-purple mb-4">Intakes</h3>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {['January', 'May', 'September'].map((month) => (
                                    <div key={month} className="bg-white rounded-lg p-4 text-center shadow-soft-3d">
                                        <span className="font-bold text-kemu-gold">{month}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                Scholarships & bursaries available: KEMUDA, CDF, and partner organizations.
                            </p>
                            <Link
                                to="/tvet/admissions"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-kemu-gold text-white rounded-xl font-semibold w-full justify-center hover:bg-kemu-gold/90 transition-colors"
                            >
                                Apply to KeMU TVET
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TVETHome;

