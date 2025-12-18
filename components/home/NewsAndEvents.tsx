import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { NewsItem, EventItem } from '../../types';

/**
 * NewsAndEvents Component - Dual-column news and events showcase
 * Features card layouts with hover effects and mobile optimization
 */

interface NewsAndEventsProps {
    news: NewsItem[];
    events: EventItem[];
    loading?: boolean;
}

interface NewsCardProps {
    item: NewsItem;
    delay: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, delay }) => {
    return (
        <Link
            to={`/news/${item.slug}`}
            className="group block backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl p-5 hover:shadow-deep-3d hover:bg-white/40 transition-all duration-300 animate-slide-up-fade"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="flex gap-4">
                {/* Date Badge */}
                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-kemu-purple/20 to-kemu-gold/20 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-kemu-purple">
                        {new Date(item.publishedAt).getDate()}
                    </div>
                    <div className="text-xs text-gray-600 uppercase">
                        {new Date(item.publishedAt).toLocaleString('default', { month: 'short' })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-lg text-kemu-purple mb-2 group-hover:text-kemu-gold transition-colors line-clamp-2">
                        {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {item.summary}
                    </p>
                    <div className="flex items-center text-xs text-kemu-purple group-hover:text-kemu-gold transition-colors">
                        <span>Read more</span>
                        <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

interface EventCardProps {
    item: EventItem;
    delay: number;
}

const EventCard: React.FC<EventCardProps> = ({ item, delay }) => {
    const [expanded, setExpanded] = React.useState(false);
    const hasDetails = item.details || item.description;

    return (
        <div
            className="group backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl p-4 hover:shadow-deep-3d hover:bg-white/40 transition-all duration-300 animate-slide-up-fade"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="flex items-start justify-between gap-3">
                {/* Left: Date Badge */}
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-kemu-purple to-kemu-blue flex flex-col items-center justify-center text-white shadow-md">
                    <div className="text-lg font-bold leading-none">
                        {new Date(item.date).getDate()}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide">
                        {new Date(item.date).toLocaleString('default', { month: 'short' })}
                    </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-base text-kemu-purple group-hover:text-kemu-gold transition-colors line-clamp-2 mb-1">
                        {item.title}
                    </h4>
                    {item.venue && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin size={12} className="text-kemu-gold flex-shrink-0" />
                            <span className="line-clamp-1">{item.venue}</span>
                        </div>
                    )}
                </div>

                {/* Expand Button */}
                {hasDetails && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex-shrink-0 p-1.5 rounded-full hover:bg-kemu-purple/10 transition-colors"
                        title={expanded ? 'Hide details' : 'View details'}
                    >
                        <ArrowRight size={16} className={`text-kemu-purple transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
                    </button>
                )}
            </div>

            {/* Expandable Description */}
            {hasDetails && expanded && (
                <div className="mt-3 pt-3 border-t border-gray-200/50 animate-fade-in">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {item.details || item.description}
                    </p>
                </div>
            )}
        </div>
    );
};

const NewsAndEvents: React.FC<NewsAndEventsProps> = ({ news, events, loading = false }) => {
    return (
        <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-transparent to-white/30">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Latest News */}
                    <div>
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-kemu-blue mb-2">
                                    Latest News
                                </h2>
                                <div className="h-1 w-20 bg-kemu-gold rounded-full"></div>
                            </div>
                            <Link
                                to="/news"
                                className="text-kemu-purple hover:text-kemu-gold font-medium flex items-center gap-1 group transition-colors"
                            >
                                <span>View All</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-gray-500">Loading news...</div>
                            ) : news.length > 0 ? (
                                news.slice(0, 3).map((item, index) => (
                                    <NewsCard key={item.id} item={item} delay={index * 0.1} />
                                ))
                            ) : (
                                <div className="text-gray-500">No news available</div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-kemu-blue mb-2">
                                Upcoming Events
                            </h2>
                            <div className="h-1 w-20 bg-kemu-gold rounded-full"></div>
                            <p className="text-gray-600 mt-4">
                                Don't miss out on what's happening at KeMU
                            </p>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-gray-500">Loading events...</div>
                            ) : events.length > 0 ? (
                                events.slice(0, 3).map((item, index) => (
                                    <EventCard key={item.id} item={item} delay={index * 0.1} />
                                ))
                            ) : (
                                <div className="text-gray-500">No upcoming events</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsAndEvents;
