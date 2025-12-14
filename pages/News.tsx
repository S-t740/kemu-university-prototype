import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, AlertCircle } from 'lucide-react';
import { getNews } from '../services/api';
import { NewsItem } from '../types';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { handleApiError, formatDate } from '../utils';
import { PLACEHOLDER_IMAGE_SEED } from '../constants';
import { NewsCard, PageHeader } from '../components';
import { useFetch } from '../hooks/useFetch';

const News: React.FC = () => {
  const { data: news, loading, error } = useFetch<NewsItem[]>('/news');

  return (
    <div className="bg-kemu-purple10 min-h-screen">
      <PageHeader
        title="University News"
        subtitle="Latest updates, events, and stories from our community."
      />

      <div className="container mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 shadow-soft-3d animate-fade-up" role="alert">
            <AlertCircle size={18} />
            <p>{error.message}</p>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <LoadingSkeleton variant="card" count={6} />
          </div>
        ) : news && news.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <NewsCard
                key={item.id}
                {...item}
                image={(item.images && item.images.length > 0) ? `http://localhost:4000${item.images[0]}` : PLACEHOLDER_IMAGE_SEED(item.id)}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-up">
            <p className="text-gray-500 text-lg">No news articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;