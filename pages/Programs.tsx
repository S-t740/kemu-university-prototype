import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Filter } from 'lucide-react';
import { DegreeType, Program } from '../types';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { ProgramCard, PageHeader, GlassSection } from '../components';
import { useFetch } from '../hooks/useFetch';
import { DEBOUNCE_DELAY } from '../constants';

const Programs: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [degreeFilter, setDegreeFilter] = useState<string>('All');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = new URLSearchParams();
  if (debouncedSearch) queryParams.append('q', debouncedSearch);
  if (degreeFilter && degreeFilter !== 'All') queryParams.append('degree', degreeFilter);

  const { data: programs, loading, error, refetch } = useFetch<Program[]>(
    `/programs?${queryParams.toString()}`,
    [debouncedSearch, degreeFilter]
  );

  // Expose refetch to window for global refresh if needed (hacky but effective for simple syncing if asked)
  // But standard way is fetching on mount which useFetch does.

  return (
    <div className="bg-kemu-purple10 min-h-screen pb-20">
      <PageHeader
        title="Academic Programs"
        subtitle="Find the perfect course to launch your career. We offer a wide range of undergraduate, postgraduate, and certificate programs."
      />

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        {/* Glass Filter Bar */}
        <GlassSection variant="light" className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 text-kemu-purple mb-2 md:mb-0">
              <Filter size={20} />
              <span className="font-semibold">Filters</span>
            </div>
            <div className="relative flex-grow w-full md:w-auto">
              <label htmlFor="program-search" className="sr-only">Search programs</label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
              <input
                id="program-search"
                type="text"
                placeholder="Search programs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold shadow-soft-3d transition-all"
                aria-label="Search programs"
              />
            </div>
            <div className="w-full md:w-64">
              <label htmlFor="degree-filter" className="sr-only">Filter by degree type</label>
              <select
                id="degree-filter"
                value={degreeFilter}
                onChange={(e) => setDegreeFilter(e.target.value)}
                className="w-full p-3 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold shadow-soft-3d transition-all"
                aria-label="Filter by degree type"
              >
                <option value="All">All Degrees</option>
                <option value={DegreeType.Undergraduate}>Undergraduate</option>
                <option value={DegreeType.Postgraduate}>Postgraduate</option>
                <option value={DegreeType.Certificate}>Certificate</option>
              </select>
            </div>
          </div>
        </GlassSection>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2" role="alert">
            <AlertCircle size={18} />
            <p>{error.message}</p>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton variant="card" count={6} />
          </div>
        ) : programs && programs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <ProgramCard
                key={program.id}
                {...program}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-up">
            <h3 className="text-2xl text-gray-400 font-bold font-serif">No programs found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;