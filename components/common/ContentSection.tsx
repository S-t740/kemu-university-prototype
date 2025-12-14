import React from 'react';

/**
 * ContentSection Component - Standard content section wrapper
 * Provides consistent spacing and optional glass effect
 */

interface ContentSectionProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    glass?: boolean;
    className?: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({
    children,
    title,
    subtitle,
    glass = false,
    className = ''
}) => {
    const baseClasses = "py-12 md:py-16 px-6 md:px-8 rounded-2xl";
    const glassClasses = glass
        ? "backdrop-blur-xl bg-white/30 border border-white/40 shadow-soft-3d"
        : "";

    return (
        <section className={`${baseClasses} ${glassClasses} ${className}`}>
            {/* Section Header */}
            {(title || subtitle) && (
                <div className="mb-8 text-center">
                    {title && (
                        <>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-kemu-blue mb-3">
                                {title}
                            </h2>
                            <div className="h-1 w-20 bg-kemu-gold rounded-full mx-auto mb-4"></div>
                        </>
                    )}
                    {subtitle && (
                        <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            {/* Content */}
            <div>
                {children}
            </div>
        </section>
    );
};

export default ContentSection;
