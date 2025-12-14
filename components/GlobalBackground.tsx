import React from 'react';

/**
 * GlobalBackground Component - Premium 3D Modern Version
 * Vibrant layered background with KeMU brand colors
 * Features large gradient orbs, mesh gradients, and sophisticated depth
 */

const GlobalBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Base Layer - Rich Gradient Mesh */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(circle at 20% 30%, rgba(135, 16, 84, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(46, 49, 146, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, rgba(160, 103, 46, 0.1) 0%, transparent 60%),
                        linear-gradient(135deg, #f8f4f9 0%, #f3e7ee 50%, #faf6f8 100%)
                    `
                }}
            />

            {/* Noise Texture for Premium Feel */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '180px 180px'
                }}
            />

            {/* Large 3D Purple Gradient Orb - Top Left */}
            <div
                className="absolute -top-64 -left-64 w-[800px] h-[800px] rounded-full blur-3xl animate-floating opacity-30"
                style={{
                    background: 'radial-gradient(circle, rgba(135, 16, 84, 0.6) 0%, rgba(135, 16, 84, 0.3) 40%, transparent 70%)',
                    animationDelay: '0s',
                    animationDuration: '20s'
                }}
            />

            {/* Large 3D Blue Gradient Orb - Bottom Right */}
            <div
                className="absolute -bottom-64 -right-64 w-[900px] h-[900px] rounded-full blur-3xl animate-floating opacity-30"
                style={{
                    background: 'radial-gradient(circle, rgba(46, 49, 146, 0.6) 0%, rgba(46, 49, 146, 0.3) 40%, transparent 70%)',
                    animationDelay: '7s',
                    animationDuration: '25s'
                }}
            />

            {/* Large 3D Gold Gradient Orb - Center Right */}
            <div
                className="absolute top-1/3 -right-48 w-[700px] h-[700px] rounded-full blur-3xl animate-floating opacity-25"
                style={{
                    background: 'radial-gradient(circle, rgba(160, 103, 46, 0.5) 0%, rgba(160, 103, 46, 0.25) 40%, transparent 70%)',
                    animationDelay: '14s',
                    animationDuration: '22s'
                }}
            />

            {/* Medium Purple Accent Orb - Middle Left */}
            <div
                className="absolute top-2/3 -left-32 w-[500px] h-[500px] rounded-full blur-2xl animate-floating opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(135, 16, 84, 0.4) 0%, transparent 60%)',
                    animationDelay: '5s',
                    animationDuration: '18s'
                }}
            />

            {/* Small Gold Accent Orb - Top Center */}
            <div
                className="absolute top-20 left-1/3 w-[400px] h-[400px] rounded-full blur-2xl animate-floating opacity-15"
                style={{
                    background: 'radial-gradient(circle, rgba(160, 103, 46, 0.4) 0%, transparent 60%)',
                    animationDelay: '10s',
                    animationDuration: '16s'
                }}
            />

            {/* Diagonal Modern Gradient Sweep */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    background: 'linear-gradient(120deg, transparent 0%, rgba(135, 16, 84, 0.3) 30%, rgba(160, 103, 46, 0.2) 50%, rgba(46, 49, 146, 0.3) 70%, transparent 100%)',
                }}
            />

            {/* Animated Light Shimmer Effect */}
            <div
                className="absolute inset-0 opacity-20 animate-sweep"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                }}
            />

            {/* Top Depth Overlay - Creates atmospheric fade */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 via-white/10 to-transparent" />

            {/* Bottom Depth Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/30 via-white/10 to-transparent" />

            {/* Corner Accent Gradients for 3D Depth */}
            <div
                className="absolute top-0 left-0 w-1/3 h-1/3 opacity-5"
                style={{
                    background: 'radial-gradient(circle at top left, rgba(135, 16, 84, 0.5) 0%, transparent 70%)'
                }}
            />
            <div
                className="absolute bottom-0 right-0 w-1/3 h-1/3 opacity-5"
                style={{
                    background: 'radial-gradient(circle at bottom right, rgba(46, 49, 146, 0.5) 0%, transparent 70%)'
                }}
            />
        </div>
    );
};

export default GlobalBackground;
