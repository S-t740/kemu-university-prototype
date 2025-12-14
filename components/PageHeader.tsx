import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backgroundImage = '/kemu-university.jpg',
  className = '',
}) => {
  return (
    <div
      className={`relative text-white py-20 lg:py-32 overflow-hidden ${className}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        }}
      ></div>

      {/* Purple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-kemu-purple/85 via-kemu-purple/75 to-kemu-blue/85 z-0"></div>

      <div className="container relative z-10 mx-auto px-4 text-center md:text-left">
        <div className="max-w-3xl animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl mb-10 text-white/90 drop-shadow-md">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
