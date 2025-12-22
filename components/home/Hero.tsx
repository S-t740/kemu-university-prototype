import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * Hero Component - Premium landing hero section
 * Features animated typography, CTAs, and integrates with GlobalBackground
 */

const Hero: React.FC = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="https://res.cloudinary.com/dpi3ynfa7/video/upload/kemu1_slbh7a.mp4" type="video/mp4" />
                </video>
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center space-y-8 animate-fade-up">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-sm">
                        <Sparkles size={16} className="text-kemu-gold" />
                        <span>A Globally Competitive Christian University</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight text-white drop-shadow-lg">
                        <span className="text-white">Transforming Lives Through</span>
                        <br />
                        <span className="text-kemu-gold drop-shadow-[0_2px_10px_rgba(160,103,46,0.5)]">Excellence in Education</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                        Producing the next generation of professional and transformational leaders across our campuses in <strong className="text-white">Meru, Nairobi, and Mombasa</strong>.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link
                            to="/programmes"
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-kemu-gold text-white rounded-xl font-semibold text-lg shadow-deep-3d hover:shadow-glow-gold hover:scale-105 transition-all duration-300"
                        >
                            <span>Explore Programs</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            to="/admissions"
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-kemu-purple hover:scale-105 transition-all duration-300"
                        >
                            <span>Apply Now</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="pt-8 flex flex-wrap justify-center gap-8 text-sm text-white/80">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-kemu-gold"></div>
                            <span>Chartered University</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <span>32,000+ Alumni</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-kemu-gold"></div>
                            <span>ISO 9001:2015 Certified</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent pointer-events-none"></div>
        </section>
    );
};

export default Hero;
