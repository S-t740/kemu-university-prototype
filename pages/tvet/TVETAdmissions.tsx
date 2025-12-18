import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, FileText, Send, CreditCard, ExternalLink, Award, Calendar, Clock, GraduationCap, Sparkles, ArrowRight, DollarSign, Users } from 'lucide-react';

/**
 * TVET Admissions Page
 */

const TVETAdmissions: React.FC = () => {
    const steps = [
        { title: 'Choose Program', desc: 'Explore our diploma, certificate, and short courses.', icon: <FileText size={24} /> },
        { title: 'Check Requirements', desc: 'Review entry requirements for your chosen program.', icon: <CheckCircle size={24} /> },
        { title: 'Submit Application', desc: 'Fill out the online application form.', icon: <Send size={24} /> },
        { title: 'Pay Fee', desc: 'Process the application fee.', icon: <CreditCard size={24} /> },
    ];

    const intakes = [
        { month: 'January', status: 'Open' },
        { month: 'May', status: 'Coming Soon' },
        { month: 'September', status: 'Coming Soon' },
    ];

    const financialAid = [
        { name: 'KEMUDA', description: 'KeMU Development Association bursaries' },
        { name: 'CDF', description: 'Constituency Development Fund support' },
        { name: 'HELB', description: 'Higher Education Loans Board' },
        { name: 'Partner Organizations', description: 'Various partner scholarships' },
    ];

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
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Admissions</h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Your journey to practical skills and career success starts here. Apply to KeMU TVET Institute today.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Steps */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-soft-3d border-t-3 border-kemu-gold relative group hover:-translate-y-1 transition-all">
                            <div className="absolute top-3 right-3 text-gray-100 font-bold text-4xl">{index + 1}</div>
                            <div className="text-kemu-purple mb-3 bg-kemu-purple10 w-12 h-12 rounded-full flex items-center justify-center">
                                {step.icon}
                            </div>
                            <h3 className="text-base font-bold text-gray-800 mb-1 font-serif">{step.title}</h3>
                            <p className="text-gray-600 text-xs leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Apply Card */}
                    <div className="bg-gradient-to-br from-kemu-blue to-kemu-purple rounded-xl shadow-deep-3d p-8 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <GraduationCap size={32} className="text-kemu-gold" />
                            <h3 className="text-2xl font-serif font-bold">Ready to Apply?</h3>
                        </div>
                        <p className="text-blue-100 mb-6">
                            KeMU TVET Institute offers quality Competence Based Education & Training (CBET) programs designed for industry readiness.
                        </p>

                        <h4 className="font-bold text-kemu-gold mb-3">Entry Requirements</h4>
                        <ul className="space-y-2 mb-6 text-sm">
                            <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-kemu-gold" />KCSE Mean Grade D (Plain) or equivalent</li>
                            <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-kemu-gold" />Copy of National ID / Passport</li>
                            <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-kemu-gold" />KCSE Result Slip / Certificate</li>
                            <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-kemu-gold" />Passport-sized photographs</li>
                        </ul>

                        <a
                            href="https://admissions.kemu.ac.ke/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-kemu-gold text-white rounded-xl font-semibold hover:bg-kemu-gold/90 transition-colors"
                        >
                            Application Portal
                            <ExternalLink size={18} />
                        </a>
                    </div>

                    {/* Intakes Card */}
                    <div className="bg-white rounded-xl shadow-deep-3d p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar size={28} className="text-kemu-purple" />
                            <h3 className="text-2xl font-serif font-bold text-kemu-purple">Intake Dates</h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            {intakes.map((intake, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-kemu-purple10/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-kemu-gold rounded-full flex items-center justify-center text-white font-bold">
                                            {intake.month.charAt(0)}
                                        </div>
                                        <span className="font-bold text-gray-800">{intake.month} Intake</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${intake.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {intake.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-kemu-purple10 rounded-lg p-4">
                            <h4 className="font-bold text-kemu-purple mb-2 flex items-center gap-2">
                                <Clock size={18} />
                                Credit Transfer & Exemptions
                            </h4>
                            <p className="text-sm text-gray-600">
                                Prior learning and qualifications may qualify for credit exemptions. Contact admissions for assessment.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Financial Aid */}
                <div className="bg-gradient-to-r from-kemu-purple to-kemu-blue rounded-xl shadow-deep-3d p-8 text-white mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Award size={32} className="text-kemu-gold" />
                        <h3 className="text-2xl font-serif font-bold">Scholarships & Financial Aid</h3>
                    </div>
                    <p className="text-white/80 mb-6">
                        We believe financial constraints shouldn't stop your dreams. Various scholarships and bursaries are available:
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {financialAid.map((aid, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign size={18} className="text-kemu-gold" />
                                    <h4 className="font-bold">{aid.name}</h4>
                                </div>
                                <p className="text-sm text-white/70">{aid.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CBET Section */}
                <div className="bg-white rounded-xl shadow-soft-3d p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Users size={28} className="text-kemu-purple" />
                        <h3 className="text-2xl font-serif font-bold text-kemu-purple">Competence Based Education & Training (CBET)</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-gray-600 mb-4">
                                KeMU TVET Institute follows the Competence Based Education and Training (CBET) curriculum, which emphasizes:
                            </p>
                            <ul className="space-y-2">
                                {[
                                    'Hands-on practical training',
                                    'Industry-aligned competencies',
                                    'Assessment based on demonstrated skills',
                                    'Flexible learning pathways',
                                    'Recognition of prior learning'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <CheckCircle className="text-kemu-gold flex-shrink-0 mt-1" size={16} />
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-kemu-purple10 rounded-lg p-6">
                            <h4 className="font-bold text-kemu-purple mb-4">Why CBET?</h4>
                            <p className="text-gray-600 text-sm mb-4">
                                CBET focuses on what you can do, not just what you know. This approach produces graduates who are immediately employable and industry-ready.
                            </p>
                            <Link
                                to="/tvet/programs"
                                className="inline-flex items-center gap-2 text-kemu-purple font-semibold hover:text-kemu-gold transition-colors"
                            >
                                Explore CBET Programs
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TVETAdmissions;
