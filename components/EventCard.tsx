import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  venue: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  venue,
  description,
  className = '',
}) => {
  const eventDate = new Date(date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

  return (
    <div className={`bg-white p-6 rounded-xl shadow-soft-3d hover:shadow-deep-3d transition-all duration-300 border-l-4 border-kemu-gold hover:-translate-y-1 animate-fade-up ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-center bg-kemu-purple10 p-3 rounded-lg min-w-[60px]">
          <span className="block text-2xl font-bold text-kemu-purple">{day}</span>
          <span className="block text-xs uppercase font-semibold text-kemu-purple">{month}</span>
        </div>
        <span className="text-xs bg-kemu-gold/10 text-kemu-gold px-3 py-1 rounded-full font-medium">
          Event
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
      
      <div className="space-y-2 mb-3">
        <p className="text-sm text-gray-500 flex items-center">
          <MapPin size={14} className="mr-2 text-kemu-purple" />
          {venue}
        </p>
        <p className="text-sm text-gray-500 flex items-center">
          <Calendar size={14} className="mr-2 text-kemu-purple" />
          {eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      {description && (
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      )}
    </div>
  );
};

export default EventCard;

