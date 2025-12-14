import React, { useEffect, useState, useRef } from 'react';
import { Users, BookOpen, MapPin, Calendar } from 'lucide-react';
import { Stats } from '../../types';

/**
 * StatsStrip Component - Animated statistics showcase
 * Features glassmorphic cards with animated counters
 */

interface StatsStripProps {
    stats: Stats | null;
}

interface StatCardProps {
    icon: React.ElementType;
    value: number;
    label: string;
    suffix?: string;
    delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, suffix = '', delay }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Ensure value is a valid number
        if (!value || isNaN(value)) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    // Animate counter
                    const duration = 2000; // 2 seconds
                    const steps = 60;
                    const increment = value / steps;
                    let currentStep = 0;

                    const timer = setInterval(() => {
                        currentStep++;
                        if (currentStep >= steps) {
                            setCount(value);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(increment * currentStep));
                        }
                    }, duration / steps);

                    return () => clearInterval(timer);
                }
            },
            { threshold: 0.5 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [value, hasAnimated]);

    return (
        <div
            ref={cardRef}
            className="group backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl p-6 md:p-8 shadow-soft-3d hover:shadow-deep-3d hover:scale-105 transition-all duration-300 animate-slide-up-fade"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="flex flex-col items-center text-center space-y-3">
                {/* Icon */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-kemu-gold/20 to-kemu-purple/20 group-hover:from-kemu-gold/30 group-hover:to-kemu-purple/30 transition-all">
                    <Icon size={32} className="text-kemu-purple" />
                </div>

                {/* Animated Value */}
                <div className="text-4xl md:text-5xl font-bold font-serif text-kemu-purple">
                    {count > 0 ? count.toLocaleString() : '0'}{suffix}
                </div>

                {/* Label */}
                <div className="text-sm md:text-base font-medium text-gray-700">
                    {label}
                </div>
            </div>
        </div>
    );
};

const StatsStrip: React.FC<StatsStripProps> = ({ stats }) => {
    // Default values if stats not loaded
    const alumniCount = stats?.students || 32000;
    const programsCount = stats?.programs || 27;
    const campusesCount = stats?.campuses || 3;
    const eventsCount = stats?.events || 50;

    return (
        <section className="relative -mt-20 z-20 px-4 pb-16">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard
                        icon={Users}
                        value={alumniCount}
                        label="Alumni Worldwide"
                        suffix="+"
                        delay={0}
                    />
                    <StatCard
                        icon={BookOpen}
                        value={programsCount}
                        label="Academic Programs"
                        delay={0.1}
                    />
                    <StatCard
                        icon={MapPin}
                        value={campusesCount}
                        label="Campuses"
                        delay={0.2}
                    />
                    <StatCard
                        icon={Calendar}
                        value={eventsCount}
                        label="Annual Events"
                        suffix="+"
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
};

export default StatsStrip;
