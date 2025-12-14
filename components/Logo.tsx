import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Kenya Methodist University Logo"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Outer dark purple band with gold borders */}
      <circle cx="100" cy="100" r="98" fill="#871054" stroke="#a0672e" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="85" fill="none" stroke="#a0672e" strokeWidth="2" />
      
      {/* Inner circle background - sky gradient */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#e0f2fe" />
          <stop offset="60%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
        <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
      
      <circle cx="100" cy="100" r="82" fill="url(#skyGradient)" />
      
      {/* Sun rays behind mountain - optimized for visibility */}
      <g stroke="#000000" strokeWidth="2" opacity="0.5">
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36 - 90) * (Math.PI / 180);
          const x1 = 100 + Math.cos(angle) * 48;
          const y1 = 100 + Math.sin(angle) * 48;
          const x2 = 100 + Math.cos(angle) * 68;
          const y2 = 100 + Math.sin(angle) * 68;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      
      {/* Mountain range - simplified and clearer */}
      <path
        d="M 35 125 L 60 85 L 85 100 L 100 65 L 115 100 L 140 85 L 165 125 L 35 125 Z"
        fill="url(#mountainGradient)"
        stroke="#1e3a8a"
        strokeWidth="1.5"
      />
      
      {/* Snow caps on peaks - more visible */}
      <path d="M 60 85 L 68 78 L 75 85 Z" fill="#ffffff" stroke="#e0f2fe" strokeWidth="0.5" />
      <path d="M 100 65 L 108 58 L 115 65 Z" fill="#ffffff" stroke="#e0f2fe" strokeWidth="0.5" />
      <path d="M 140 85 L 148 78 L 155 85 Z" fill="#ffffff" stroke="#e0f2fe" strokeWidth="0.5" />
      
      {/* Landscape/water below mountain - simplified */}
      <ellipse cx="100" cy="135" rx="65" ry="22" fill="#7dd3fc" opacity="0.6" />
      <ellipse cx="100" cy="140" rx="60" ry="18" fill="#86efac" opacity="0.7" />
      
      {/* University name text in the band - improved readability */}
      <text
        x="100"
        y="28"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontFamily="serif"
        fontWeight="bold"
        letterSpacing="1"
      >
        KENYA • METHODIST
      </text>
      <text
        x="100"
        y="172"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontFamily="serif"
        fontWeight="bold"
        letterSpacing="1"
      >
        UNIVERSITY
      </text>
    </svg>
  );
};

export default Logo;

