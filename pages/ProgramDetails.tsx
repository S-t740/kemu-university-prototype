import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Building, AlertCircle } from 'lucide-react';
import { Program } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFetch } from '../hooks/useFetch';

const ProgramDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: program, loading, error } = useFetch<Program>(slug ? `/programs/${slug}` : '');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Program Not Found</h2>
          <p className="text-gray-600 mb-6">{error?.message || 'The program you are looking for does not exist.'}</p>
          <Link
            to="/programs"
            className="inline-flex items-center text-kemu-blue hover:text-kemu-purple font-medium focus:outline-none focus:ring-2 focus:ring-kemu-blue rounded"
          >
            <ArrowLeft size={18} className="mr-2" aria-hidden="true" /> Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero with background image */}
      <div className="relative text-white py-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/kemu-university.jpg"
            alt="KeMU Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-kemu-purple/85 via-kemu-purple/75 to-kemu-blue/85"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link to="/programmes" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Programs
          </Link>
          <span className="block text-kemu-gold font-bold tracking-wide uppercase text-sm mb-2">{program.degreeType}</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 drop-shadow-lg">{program.title}</h1>
          <div className="flex flex-wrap gap-6 text-white/90">
            <div className="flex items-center">
              <Building size={20} className="mr-2 text-kemu-gold" />
              <span>{program.school?.name || program.faculty}</span>
            </div>
            {program.duration && (
              <div className="flex items-center">
                <Clock size={20} className="mr-2 text-kemu-gold" />
                <span>{program.duration}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Program Overview</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {program.overview}
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Kenya Methodist University is committed to providing market-driven courses with strong industry linkages and opportunities outside the classroom. Our programmes are designed to provide positive career outcomes for students in their chosen fields, combining academic excellence with practical skills and Christian values.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Requirements</h2>
            {program.requirements ? (
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {program.requirements}
              </div>
            ) : (
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Minimum Mean Grade of C+ in KCSE</li>
                <li>Subject specific requirements apply.</li>
              </ul>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Admissions</h3>
            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 p-4 rounded border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Next Intake</p>
                <p className="font-bold text-kemu-purple">September 2025</p>
                <p className="text-xs text-gray-400 mt-1">Trimester 3, 2025</p>
              </div>
              <div className="bg-gray-50 p-4 rounded border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Intakes Available</p>
                <p className="font-bold text-kemu-purple">January, May, September</p>
              </div>
            </div>
            <Link to="/admissions" className="block w-full text-center bg-kemu-gold hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded transition-colors mb-3">
              Apply Now
            </Link>
            <button className="block w-full text-center border-2 border-kemu-blue text-kemu-blue hover:bg-kemu-blue hover:text-white font-bold py-3 px-4 rounded transition-colors">
              Download Brochure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;