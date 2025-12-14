import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * CallToActionBanner Component - Strong closing CTA
 * Features glass banner with gradient, prominent buttons, and glow effects
 */

const CallToActionBanner: React.FC = () => {
    return (
        <section className="relative py-16 md:py-24 px-4 overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-kemu-purple/20 via-kemu-gold/20 to-kemu-blue/20 blur-3xl"></div>
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Glass Banner */}
                <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 md:p-12 lg:p-16 shadow-deep-3d">
                    <div className="text-center space-y-8">
                        {/* Icon Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kemu-gold/20 backdrop-blur-sm border border-kemu-gold/30">
                            <Sparkles size={18} className="text-kemu-gold" />
                            <span className="text-sm font-medium text-kemu-purple">Start Your Journey</span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold">
                            <span className="text-kemu-purple">Ready to Join</span>{' '}
                            <span className="text-kemu-gold">KeMU?</span>
                        </h2>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                            Take the first step towards transformational education and become part of our vibrant community of scholars and leaders.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Link
                                to="/admissions"
                                className="group inline-flex items-center gap-2 px-10 py-5 bg-kemu-gold text-white rounded-xl font-bold text-lg shadow-deep-3d hover:shadow-glow-gold hover:scale-105 transition-all duration-300 animate-pulse-glow"
                            >
                                <span>Apply Now</span>
                                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/programs"
                                className="group inline-flex items-center gap-2 px-10 py-5 bg-kemu-purple text-white rounded-xl font-bold text-lg shadow-deep-3d hover:shadow-glow-purple hover:scale-105 transition-all duration-300"
                            >
                                <span>Explore Programs</span>
                                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Supporting Info */}
                        <div className="pt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-kemu-gold"></div>
                                <span>Multiple Intake Periods</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-kemu-purple"></div>
                                <span>Scholarships Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-kemu-blue"></div>
                                <span>Flexible Learning Options</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToActionBanner;
