import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { NewsItem } from '../../types';
import { formatDate } from '../../utils';
import { PLACEHOLDER_IMAGE_SEED, API_BASE_URL } from '../../constants';

/**
 * TVET News Page - Shows TVET-specific news articles
 * Same design as main News page, filtered by institution
 */

const TVETNews: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_BASE_URL}/news?institution=TVET`);
                if (!response.ok) throw new Error('Failed to fetch news');
                const data = await response.json();
                setNews(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load news');
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="min-h-screen bg-kemu-purple10/30">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-br from-kemu-purple via-kemu-blue to-kemu-purple overflow-hidden">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-sm mb-4">
                            <Sparkles size={16} className="text-kemu-gold" />
                            <span>KeMU TVET Institute</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">TVET News & Updates</h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Stay informed with the latest news, events, and stories from our TVET community.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 shadow-soft-3d animate-fade-up" role="alert">
                        <AlertCircle size={18} />
                        <p>{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-kemu-purple" size={48} />
                    </div>
                ) : news && news.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item, index) => (
                            <Link
                                key={item.id}
                                to={`/news/${item.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-soft-3d hover:shadow-deep-3d transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Image */}
                                <div className="aspect-video overflow-hidden relative">
                                    <img
                                        src={(item.images && item.images.length > 0)
                                            ? `http://localhost:4000${item.images[0]}`
                                            : PLACEHOLDER_IMAGE_SEED(item.id)}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                    <div className="absolute top-4 left-4">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-kemu-purple/90 text-white text-xs font-medium">
                                            <Sparkles size={12} />
                                            TVET
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                        <Calendar size={14} className="text-kemu-gold" />
                                        <span>{formatDate(item.publishedAt)}</span>
                                    </div>
                                    <h3 className="font-serif font-bold text-lg text-gray-800 mb-3 line-clamp-2 group-hover:text-kemu-purple transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {item.summary || item.content?.substring(0, 150) + '...'}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 animate-fade-up">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles size={40} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg mb-4">No TVET news articles found.</p>
                        <Link
                            to="/tvet"
                            className="text-kemu-purple hover:text-kemu-gold transition-colors font-medium"
                        >
                            ← Back to TVET Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TVETNews;
