import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Map, Calendar } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [stats, setStats] = useState({ programs: 0, news: 0, events: 0, students: 32000, campuses: 3 });
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, eventsRes, programsRes] = await Promise.all([
          api.get('/news?limit=3'),
          api.get('/events'),
          api.get('/programs')
        ]);
        
        setNews(newsRes.data);
        setEvents(eventsRes.data.slice(0, 3));
        setStats(prev => ({
          ...prev,
          programs: programsRes.data.length,
          news: newsRes.data.length,
          events: eventsRes.data.length
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative text-white py-20 lg:py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #871054 0%, #871054 50%, #2e3192 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 15s ease infinite',
        }}
      >
        <div className="container relative z-10 mx-auto px-4 text-center md:text-left">
          <div className="max-w-3xl animate-fade-up">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              A Globally Competitive <span className="text-kemu-gold">Christian University</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-200">
              Producing the next generation of professional and transformational leaders. Chartered Christian University with campuses in Meru, Nairobi, and Mombasa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/programs" className="gold-btn inline-flex items-center justify-center">
                <ArrowRight size={18} className="mr-2" />
                Explore Programs
              </Link>
              <Link to="/admissions" className="outline-btn inline-flex items-center justify-center">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="-mt-12 relative z-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card bg-white/95 backdrop-blur-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="stat-card">
                <Users className="text-kemu-gold mb-3" size={32} />
                <h3 className="text-3xl font-bold text-kemu-purple mb-2">{stats.students > 1000 ? `${(stats.students / 1000).toFixed(0)}K+` : stats.students}</h3>
                <p className="text-gray-600 text-sm text-center">Alumni Worldwide</p>
              </div>
              <div className="stat-card">
                <BookOpen className="text-kemu-gold mb-3" size={32} />
                <h3 className="text-3xl font-bold text-kemu-purple mb-2">{stats.programs}</h3>
                <p className="text-gray-600 text-sm text-center">Academic Programs</p>
              </div>
              <div className="stat-card">
                <Map className="text-kemu-gold mb-3" size={32} />
                <h3 className="text-3xl font-bold text-kemu-purple mb-2">{stats.campuses}</h3>
                <p className="text-gray-600 text-sm text-center">Campuses</p>
              </div>
              <div className="stat-card">
                <Calendar className="text-kemu-gold mb-3" size={32} />
                <h3 className="text-3xl font-bold text-kemu-purple mb-2">{stats.events}</h3>
                <p className="text-gray-600 text-sm text-center">Upcoming Events</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-kemu-blue">Latest News</h2>
            <div className="h-1 w-20 bg-kemu-gold mt-2"></div>
          </div>
          <Link to="/news" className="text-kemu-purple font-medium hover:text-kemu-gold flex items-center">
            View All News <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 text-center py-12">Loading...</div>
          ) : news.length > 0 ? (
            news.map(item => (
              <Link key={item.id} to={`/news/${item.slug}`} className="program-card group">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-kemu-purple transition-colors">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.summary || item.content.substring(0, 150)}</p>
                <span className="text-kemu-gold font-semibold text-sm">Read More →</span>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">No news available</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;


