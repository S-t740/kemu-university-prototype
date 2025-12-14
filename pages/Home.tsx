import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { getStats, getNews, getEvents } from '../services/api';
import { Stats, NewsItem, EventItem } from '../types';
import { handleApiError } from '../utils';
import {
  Hero,
  StatsStrip,
  AboutSection,
  SchoolsShowcase,
  NewsAndEvents,
  CallToActionBanner
} from '../components/home';

/**
 * Home Page - Premium university landing page
 * World-class design with modern components and animations
 */

const Home: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, newsData, eventsData] = await Promise.all([
          getStats(),
          getNews(),
          getEvents()
        ]);
        setStats(statsData);
        setNews(newsData);
        setEvents(eventsData);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative">
      {/* Error Alert */}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-2xl mx-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-deep-3d backdrop-blur-xl" role="alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <Hero />

      {/* Stats Strip (overlapping hero) */}
      <StatsStrip stats={stats} />

      {/* About Section */}
      <AboutSection />

      {/* Schools Showcase */}
      <SchoolsShowcase />

      {/* News & Events */}
      <NewsAndEvents news={news} events={events} loading={loading} />

      {/* Call to Action Banner */}
      <CallToActionBanner />
    </div>
  );
};

export default Home;