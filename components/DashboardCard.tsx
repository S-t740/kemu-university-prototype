import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  stat?: string | number;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon: Icon,
  href,
  onClick,
  stat,
  className = '',
}) => {
  const cardContent = (
    <div className={`bg-white rounded-xl shadow-soft-3d hover:shadow-deep-3d transition-all duration-300 p-6 border border-kemu-purple30 hover:-translate-y-1 group ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-kemu-purple10 rounded-lg">
          <Icon size={24} className="text-kemu-purple" />
        </div>
        {(href || onClick) && (
          <ArrowRight size={20} className="text-gray-400 group-hover:text-kemu-gold group-hover:translate-x-1 transition-all" />
        )}
      </div>
      
      {stat !== undefined && (
        <div className="mb-2">
          <span className="text-3xl font-bold text-kemu-purple">{stat}</span>
        </div>
      )}
      
      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-kemu-purple transition-colors">
        {title}
      </h3>
      
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block">
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {cardContent}
      </button>
    );
  }

  return cardContent;
};

export default DashboardCard;

