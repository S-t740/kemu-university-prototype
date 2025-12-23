import React from 'react';
import { Link } from 'react-router-dom';
import { Award, GraduationCap, Target, Heart, Users, BookOpen, Building, MapPin, Phone, Mail, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

/**
 * TVET About Page - About KeMU TVET Institute
 */

const TVETAbout: React.FC = () => {
    const coreValues = [
        { icon: Heart, title: 'Excellence', description: 'Commitment to highest standards in CBET delivery' },
        { icon: Users, title: 'Inclusivity', description: 'Welcoming learners from all backgrounds' },
        { icon: Target, title: 'Innovation', description: 'Embracing modern training approaches' },
        { icon: BookOpen, title: 'Integrity', description: 'Honest and ethical practices' },
    ];

    const programLevels = [
        { level: 'Level 6', title: 'Diploma', count: 17, duration: '2 Years' },
        { level: 'Level 5', title: 'Craft Certificate', count: 11, duration: '1 Year' },
        { level: 'Level 4', title: 'Artisan Certificate', count: 1, duration: '6 Months' },
        { level: 'Various', title: 'Short Courses', count: 10, duration: 'Flexible' },
    ];

    return (
        <div className="min-h-screen bg-kemu-purple10/30">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-br from-kemu-purple via-kemu-blue to-kemu-purple overflow-hidden">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-sm mb-4">
                            <Sparkles size={16} className="text-kemu-gold" />
                            <span>TVETA Licensed Institution</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">About KeMU TVET Institute</h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            "Dreams are still valid." — Providing quality competency-based education and training since our establishment.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Identity Section */}
                <div className="bg-white rounded-xl shadow-soft-3d p-8 mb-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="text-kemu-gold" size={32} />
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-kemu-purple">KeMU TVET Institute</h2>
                                    <p className="text-sm text-gray-500">A Kenya Methodist University Institution</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-kemu-purple10 rounded-lg p-4">
                                    <h3 className="font-bold text-kemu-purple mb-1">Accreditation</h3>
                                    <p className="text-sm text-gray-700">
                                        TVETA Licensed — <span className="font-mono text-kemu-gold">TVETA/PRIVATE/TVC/0042/2021AI</span>
                                    </p>
                                </div>
                                <div className="bg-kemu-gold/10 rounded-lg p-4">
                                    <h3 className="font-bold text-kemu-gold mb-1">Our Motto</h3>
                                    <p className="text-lg font-serif italic text-gray-700">"Dreams are still valid."</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-kemu-purple/10 to-kemu-blue/10 rounded-xl p-6">
                            <img
                                src="/kemu-university.jpg"
                                alt="KeMU TVET Campus"
                                className="rounded-lg shadow-soft-3d w-full h-64 object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gradient-to-br from-kemu-purple to-kemu-blue rounded-xl p-8 text-white shadow-deep-3d">
                        <div className="flex items-center gap-3 mb-4">
                            <GraduationCap className="text-kemu-gold" size={32} />
                            <h2 className="text-2xl font-serif font-bold">Our Vision</h2>
                        </div>
                        <p className="text-white/90 leading-relaxed text-lg">
                            A centre of excellence in Competence Based Education and Training providing holistic nurturing to inspire innovation and self-reliance.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-kemu-blue to-kemu-purple rounded-xl p-8 text-white shadow-deep-3d">
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="text-kemu-gold" size={32} />
                            <h2 className="text-2xl font-serif font-bold">Our Mission</h2>
                        </div>
                        <p className="text-white/90 leading-relaxed text-lg">
                            Provide quality competency-based education and training that recognizes and nurtures the potential of each learner towards achieving higher standards of excellence.
                        </p>
                    </div>
                </div>

                {/* Core Values */}
                <div className="mb-12">
                    <h2 className="text-2xl font-serif font-bold text-kemu-purple mb-6 text-center">Our Core Values</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreValues.map((value, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-soft-3d hover:shadow-deep-3d transition-all text-center">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-kemu-purple10 flex items-center justify-center">
                                    <value.icon className="text-kemu-purple" size={28} />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">{value.title}</h3>
                                <p className="text-sm text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Program Levels */}
                <div className="bg-white rounded-xl shadow-soft-3d p-8 mb-12">
                    <h2 className="text-2xl font-serif font-bold text-kemu-purple mb-6 text-center">Program Structure</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {programLevels.map((level, index) => (
                            <div key={index} className="bg-kemu-purple10/50 rounded-xl p-6 text-center">
                                <span className="inline-block px-3 py-1 bg-kemu-gold text-white text-xs font-bold rounded-full mb-3">
                                    {level.level}
                                </span>
                                <h3 className="text-lg font-serif font-bold text-kemu-purple mb-1">{level.title}</h3>
                                <p className="text-3xl font-bold text-kemu-gold mb-1">{level.count}</p>
                                <p className="text-sm text-gray-600">Programs • {level.duration}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <Link
                            to="/tvet/programs"
                            className="inline-flex items-center gap-2 text-kemu-purple font-semibold hover:text-kemu-gold transition-colors"
                        >
                            View All Programs
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* Why TVET */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-kemu-purple mb-6">Why Choose TVET?</h2>
                        <div className="space-y-4">
                            {[
                                'Practical, hands-on skills training',
                                'Industry-aligned curriculum (CBET)',
                                'Shorter duration, faster entry to workforce',
                                'More affordable than traditional degrees',
                                'Direct pathway to employment',
                                'Recognized by TVETA and industry'
                            ].map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="text-kemu-gold flex-shrink-0 mt-1" size={20} />
                                    <span className="text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-kemu-gold/20 to-kemu-purple/20 rounded-xl p-8">
                        <h3 className="text-xl font-serif font-bold text-kemu-purple mb-4">Contact Us</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Building className="text-kemu-purple flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="font-medium text-gray-800">KeMU TVET Institute</p>
                                    <p className="text-sm text-gray-600">Kenya Methodist University</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-kemu-purple" size={20} />
                                <span className="text-gray-700">Meru Main Campus</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="text-kemu-purple" size={20} />
                                <span className="text-gray-700">+254 724 256 162</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="text-kemu-purple" size={20} />
                                <span className="text-gray-700">tvet@kemu.ac.ke</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Link
                                to="/tvet/student-apply"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-kemu-gold text-white rounded-xl font-semibold w-full justify-center hover:bg-kemu-gold/90 transition-colors"
                            >
                                Apply Now
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TVETAbout;
