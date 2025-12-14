import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, className = '' }) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="text-kemu-gold mb-3">
        <Icon size={32} />
      </div>
      <h3 className="text-3xl font-bold text-kemu-purple mb-2">{value}</h3>
      <p className="text-gray-600 text-sm text-center">{label}</p>
    </div>
  );
};

export default StatCard;

