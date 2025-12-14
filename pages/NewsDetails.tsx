import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import DOMPurify from 'dompurify';
import { getNewsBySlug } from '../services/api';
import { NewsItem } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, handleApiError } from '../utils';
import { PLACEHOLDER_IMAGE_SEED } from '../constants';
import { useFetch } from '../hooks/useFetch';

const NewsDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, loading, error } = useFetch<NewsItem>(slug ? `/news/${slug}` : '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get images array or fallback to placeholder
  const images = article?.images && article.images.length > 0
    ? article.images.map(img => `http://localhost:4000${img}`)
    : [PLACEHOLDER_IMAGE_SEED(article?.id || 0)];

  // Auto-rotate slideshow every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const sanitizeContent = (content: string): string => {
    const withBreaks = content.replace(/\n/g, '<br/><br/>');
    return DOMPurify.sanitize(withBreaks, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'target'],
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">{error?.message || 'The article you are looking for does not exist.'}</p>
          <Link
            to="/news"
            className="inline-flex items-center text-kemu-purple hover:text-kemu-blue font-medium"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Animated Image Slideshow */}
      <div className="h-[40vh] md:h-[50vh] relative overflow-hidden">
        {/* Images */}
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={img}
              alt={`${article.title} - Image ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" aria-hidden="true"></div>

        {/* Navigation Arrows (only show if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Indicators (dots) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                  }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto text-white">
          <Link
            to="/news"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white rounded"
            aria-label="Back to news list"
          >
            <ArrowLeft size={16} className="mr-2" aria-hidden="true" /> Back to News
          </Link>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 drop-shadow-lg">{article.title}</h1>
          <div className="flex items-center space-x-6 text-sm" role="contentinfo">
            <span className="flex items-center" aria-label={`Published on ${formatDate(article.publishedAt)}`}>
              <Calendar size={16} className="mr-2" aria-hidden="true" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center" aria-label={`Author: ${article.author}`}>
              <User size={16} className="mr-2" aria-hidden="true" />
              {article.author}
            </span>
            {images.length > 1 && (
              <span className="flex items-center text-white/80">
                {currentImageIndex + 1} / {images.length} photos
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-12">
        <article className="md:col-span-3">
          <div className="prose prose-lg prose-purple max-w-none text-gray-700">
            <p className="font-semibold text-xl mb-6 text-gray-900 leading-relaxed">{article.summary}</p>
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeContent(article.content) }}
              className="article-content"
            />
          </div>
        </article>
        <aside className="md:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">Share this article</h3>
            <div className="flex flex-col gap-2">
              <button
                className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                aria-label="Share on Facebook"
              >
                Facebook
              </button>
              <button
                className="w-full bg-sky-500 text-white py-2 rounded text-sm font-medium hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors"
                aria-label="Share on Twitter"
              >
                Twitter
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewsDetails;