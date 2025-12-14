import React from 'react';
import { Target, Heart, Lightbulb } from 'lucide-react';
import GlassSection from '../GlassSection';

/**
 * AboutSection Component - Premium about section with glass cards
 * Features Vision, Core Values, and Our Motto cards with gold glow effects
 */

interface MiniCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    delay: number;
}

const MiniCard: React.FC<MiniCardProps> = ({ icon: Icon, title, description, delay }) => {
    return (
        <div
            className="group relative p-6 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-kemu-gold/30 hover:border-kemu-gold hover:shadow-glow-gold transition-all duration-300 animate-slide-up-fade hover:scale-105"
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Icon */}
            <div className="flex justify-center mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-kemu-gold/20 to-kemu-purple/20">
                    <Icon size={28} className="text-kemu-purple" />
                </div>
            </div>

            {/* Title */}
            <h3 className="font-serif font-bold text-xl text-kemu-purple mb-3 text-center">
                {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-700 text-center leading-relaxed">
                {description}
            </p>
        </div>
    );
};

const AboutSection: React.FC = () => {
    return (
        <section className="py-16 md:py-24 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Main Container */}
                <GlassSection className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-kemu-blue">
                            About Kenya Methodist University
                        </h2>
                        <div className="h-1 w-24 bg-kemu-gold mx-auto rounded-full"></div>
                    </div>

                    {/* Description */}
                    <p className="text-base md:text-lg text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
                        Kenya Methodist University is a <strong>Chartered Christian University</strong> with our main campus in Meru and additional campuses in Nairobi and Mombasa. We offer PhD, Masters, Degree, Diploma, and Certificate programmes. KeMU has over <strong>32,000 alumni</strong> and is the <strong>first and only private university in Kenya to graduate medical doctors</strong>.
                    </p>

                    {/* Mini Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-6 pt-8">
                        <MiniCard
                            icon={Target}
                            title="Our Vision"
                            description="A globally competitive Christian University producing the next generation of professional and transformational leaders."
                            delay={0.2}
                        />
                        <MiniCard
                            icon={Heart}
                            title="Core Values"
                            description="We produce professionally competent men and women of integrity who are spiritually well nurtured and socially responsible."
                            delay={0.3}
                        />
                        <MiniCard
                            icon={Lightbulb}
                            title="Our Focus"
                            description="Market-driven courses, strong industry linkages, and comprehensive opportunities beyond the classroom for holistic development."
                            delay={0.4}
                        />
                    </div>
                </GlassSection>
            </div>
        </section>
    );
};

export default AboutSection;
