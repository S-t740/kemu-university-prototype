import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { formatDate } from '../utils';

interface NewsCardProps {
  id: number;
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  author: string;
  image?: string;
  className?: string;
  style?: React.CSSProperties;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  slug,
  summary,
  publishedAt,
  author,
  image,
  className = '',
  style,
}) => {
  return (
    <article className={`bg-white rounded-xl shadow-soft-3d hover:shadow-deep-3d transition-all duration-300 overflow-hidden border border-gray-100 group animate-fade-up ${className}`} style={style}>
      {image && (
        <Link to={`/news/${slug}`} className="block h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
      )}
      
      <div className="p-6">
        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
          <span className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {formatDate(publishedAt)}
          </span>
          <span className="flex items-center">
            <User size={14} className="mr-1" />
            {author}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-kemu-purple transition-colors line-clamp-2">
          <Link to={`/news/${slug}`} className="focus:outline-none focus:ring-2 focus:ring-kemu-purple rounded">
            {title}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{summary}</p>
        
        <Link
          to={`/news/${slug}`}
          className="text-kemu-gold font-semibold text-sm hover:underline inline-flex items-center focus:outline-none focus:ring-2 focus:ring-kemu-gold rounded"
        >
          Read Full Story
        </Link>
      </div>
    </article>
  );
};

export default NewsCard;

