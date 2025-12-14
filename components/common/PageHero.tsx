import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * PageHero Component - Standard hero for content pages
 * Provides consistent page headers with title, breadcrumb, and optional subtitle
 * Uses KeMU university image as background with purple overlay
 */

interface PageHeroProps {
    title: string;
    subtitle?: string;
    breadcrumb?: string[];
    className?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
    title,
    subtitle,
    breadcrumb = ['Home'],
    className = ''
}) => {
    return (
        <section className={`relative py-20 md:py-28 px-4 overflow-hidden ${className}`}>
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="/kemu-university.jpg"
                    alt="KeMU Campus"
                    className="w-full h-full object-cover"
                />
                {/* Purple gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-kemu-purple/85 via-kemu-purple/75 to-kemu-blue/85"></div>
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Breadcrumb - only show if there are multiple items */}
                {breadcrumb.length > 1 && (
                    <nav className="flex items-center gap-2 mb-6 text-sm">
                        {breadcrumb.map((item, index) => (
                            <React.Fragment key={index}>
                                {index === 0 ? (
                                    <Link to="/" className="text-white/80 hover:text-kemu-gold transition-colors">
                                        {item}
                                    </Link>
                                ) : index === breadcrumb.length - 1 ? (
                                    <span className="text-white/60">{item}</span>
                                ) : (
                                    <Link to={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-white/80 hover:text-kemu-gold transition-colors">
                                        {item}
                                    </Link>
                                )}
                                {index < breadcrumb.length - 1 && (
                                    <ChevronRight size={16} className="text-white/40" />
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg">
                    {title}
                </h1>

                {/* Gold Underline */}
                <div className="h-1 w-24 bg-kemu-gold rounded-full mb-6"></div>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-lg md:text-xl text-white/90 max-w-3xl drop-shadow-md">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
};

export default PageHero;
