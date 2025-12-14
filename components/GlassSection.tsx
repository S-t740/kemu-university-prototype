import React from 'react';

/**
 * GlassSection Component
 * Reusable glassmorphic card wrapper for premium content sections
 * Provides backdrop blur, transparency, and elegant borders
 */

interface GlassSectionProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    animate?: boolean;
    [key: string]: any;
}

const GlassSection: React.FC<GlassSectionProps> = ({
    children,
    title,
    className = '',
    animate = false,
    ...props
}) => {
    const baseClasses = `
    w-full
    backdrop-blur-xl 
    bg-white/20 
    border border-white/30 
    rounded-3xl 
    p-6 md:p-10 
    shadow-[0_8px_20px_rgba(0,0,0,0.1)]
    hover:shadow-[0_12px_28px_rgba(0,0,0,0.15)]
    transition-all duration-300
  `;

    const animationClasses = animate ? 'animate-fade-up' : '';

    return (
        <div
            className={`${baseClasses} ${animationClasses} ${className}`}
            {...props}
        >
            {title && (
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="w-1 h-6 bg-gradient-to-b from-kemu-purple to-kemu-blue rounded-full mr-3"></span>
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
};

export default GlassSection;
