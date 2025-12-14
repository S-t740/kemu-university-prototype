import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, GraduationCap } from 'lucide-react';

interface ProgramCardProps {
  id: number;
  title: string;
  slug: string;
  faculty: string;
  duration: string;
  degreeType: string;
  overview?: string;
  className?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  title,
  slug,
  faculty,
  duration,
  degreeType,
  overview,
  className = '',
}) => {
  return (
    <Link
      to={`/programs/${slug}`}
      className={`program-card group ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="inline-block px-3 py-1 bg-kemu-purple10 text-kemu-purple text-xs font-bold rounded-full">
          {degreeType}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-kemu-gold transition-colors line-clamp-2">
        {title}
      </h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <GraduationCap size={16} className="mr-2 text-kemu-purple" />
          <span>{faculty}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={16} className="mr-2 text-kemu-purple" />
          <span>{duration}</span>
        </div>
      </div>
      
      {overview && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{overview}</p>
      )}
      
      <div className="flex items-center text-kemu-blue font-semibold text-sm group-hover:text-kemu-gold transition-colors">
        Learn More <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

export default ProgramCard;

