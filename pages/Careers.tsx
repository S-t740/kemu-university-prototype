import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, Calendar, Clock, Search, Filter, AlertCircle, ChevronRight } from 'lucide-react';
import { getVacancies } from '../services/api';
import { Vacancy } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { PageHeader } from '../components';
import { handleApiError, formatDate } from '../utils';
import Modal from '../components/Modal';
import { Link } from 'react-router-dom';

const Careers: React.FC = () => {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedLocation, setSelectedLocation] = useState<string>('all');
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

    useEffect(() => {
        fetchVacancies();
    }, []);

    const fetchVacancies = async () => {
        setLoading(true);
        setError(null);
        try {
            // Exclude TVET vacancies from main careers page
            const data = await getVacancies({ excludeInstitution: 'TVET' });
            setVacancies(data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };


    const filteredVacancies = vacancies.filter(vacancy => {
        const matchesSearch = vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vacancy.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || vacancy.type === selectedType;
        const matchesLocation = selectedLocation === 'all' || vacancy.location === selectedLocation;
        return matchesSearch && matchesType && matchesLocation;
    });

    const types = ['all', ...Array.from(new Set(vacancies.map(v => v.type)))];
    const locations = ['all', ...Array.from(new Set(vacancies.map(v => v.location)))];

    const isExpired = (deadline: string) => new Date(deadline) < new Date();

    return (
        <div className="bg-gradient-to-br from-kemu-purple/5 via-white to-kemu-blue/5 min-h-screen">
            <PageHeader
                title="Careers at KeMU"
                subtitle="Join our community of educators, researchers, and transformational leaders shaping the future"
            />

            <div className="container mx-auto px-4 py-16">
                {/* Why Work at KeMU Section */}
                <section className="mb-20 animate-fade-up">
                    <div className="bg-gradient-to-br from-white via-white to-gray-50/50 backdrop-blur-md rounded-3xl p-10 shadow-deep-3d border border-white/60">
                        <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-kemu-purple to-kemu-blue bg-clip-text text-transparent mb-8 text-center">
                            Why Choose KeMU?
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-8 bg-gradient-to-br from-kemu-gold/10 to-transparent rounded-2xl hover:shadow-soft-3d transition-all duration-300 hover:scale-105">
                                <div className="w-20 h-20 bg-gradient-to-br from-kemu-gold to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Briefcase className="text-white" size={36} />
                                </div>
                                <h3 className="font-bold text-xl text-kemu-purple mb-3">Professional Growth</h3>
                                <p className="text-gray-600 leading-relaxed">Continuous development opportunities, mentorship programs, and clear career advancement pathways</p>
                            </div>
                            <div className="text-center p-8 bg-gradient-to-br from-kemu-purple/10 to-transparent rounded-2xl hover:shadow-soft-3d transition-all duration-300 hover:scale-105">
                                <div className="w-20 h-20 bg-gradient-to-br from-kemu-purple to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <MapPin className="text-white" size={36} />
                                </div>
                                <h3 className="font-bold text-xl text-kemu-purple mb-3">Multiple Campuses</h3>
                                <p className="text-gray-600 leading-relaxed">Opportunities across Meru, Nairobi, and Mombasa campuses with modern facilities</p>
                            </div>
                            <div className="text-center p-8 bg-gradient-to-br from-kemu-blue/10 to-transparent rounded-2xl hover:shadow-soft-3d transition-all duration-300 hover:scale-105">
                                <div className="w-20 h-20 bg-gradient-to-br from-kemu-blue to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Clock className="text-white" size={36} />
                                </div>
                                <h3 className="font-bold text-xl text-kemu-purple mb-3">Christian Values</h3>
                                <p className="text-gray-600 leading-relaxed">Work in a purpose-driven environment that values integrity, excellence, and service</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters and Search */}
                <div className="mb-10 bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-soft-3d border border-gray-100 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-xl font-bold text-kemu-purple mb-6 flex items-center gap-2">
                        <Filter size={24} />
                        Find Your Perfect Role
                    </h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                <Search size={18} className="inline mr-2" />
                                Search Positions
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by title or department..."
                                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold transition-all shadow-sm hover:shadow-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                <Briefcase size={18} className="inline mr-2" />
                                Position Type
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold transition-all shadow-sm hover:shadow-md appearance-none bg-white cursor-pointer"
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>
                                        {type === 'all' ? 'All Types' : type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                <MapPin size={18} className="inline mr-2" />
                                Location
                            </label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold transition-all shadow-sm hover:shadow-md appearance-none bg-white cursor-pointer"
                            >
                                {locations.map(location => (
                                    <option key={location} value={location}>
                                        {location === 'all' ? 'All Locations' : location}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 shadow-soft-3d animate-fade-up" role="alert">
                        <AlertCircle size={18} />
                        <p>{error}</p>
                    </div>
                )}

                {/* Vacancies List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : filteredVacancies.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredVacancies.map((vacancy, index) => (
                            <div
                                key={vacancy.id}
                                className="bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm rounded-2xl p-7 shadow-soft-3d border border-gray-100 hover:shadow-deep-3d hover:scale-102 hover:border-kemu-gold/30 transition-all duration-300 cursor-pointer animate-slide-up-fade group"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => setSelectedVacancy(vacancy)}
                            >
                                <div className="flex items-start justify-between mb-5">
                                    <h3 className="font-serif font-bold text-xl text-gray-800 pr-3 line-clamp-2 group-hover:text-kemu-purple transition-colors">{vacancy.title}</h3>
                                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm ${vacancy.type === 'Academic' ? 'bg-gradient-to-r from-kemu-purple to-purple-600 text-white' :
                                        vacancy.type === 'Administrative' ? 'bg-gradient-to-r from-kemu-blue to-blue-600 text-white' :
                                            'bg-gradient-to-r from-kemu-gold to-yellow-600 text-white'
                                        }`}>
                                        {vacancy.type}
                                    </span>
                                </div>

                                <div className="space-y-3 text-sm text-gray-600 mb-6">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group-hover:bg-kemu-purple/5 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-kemu-gold/20 flex items-center justify-center flex-shrink-0">
                                            <Briefcase size={16} className="text-kemu-gold" />
                                        </div>
                                        <span className="line-clamp-1 font-medium">{vacancy.department}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group-hover:bg-kemu-blue/5 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-kemu-blue/20 flex items-center justify-center flex-shrink-0">
                                            <MapPin size={16} className="text-kemu-blue" />
                                        </div>
                                        <span className="font-medium">{vacancy.location}</span>
                                    </div>
                                    <div className={`flex items-center gap-3 p-3 rounded-lg ${isExpired(vacancy.deadline) ? 'bg-red-50' : 'bg-gray-50 group-hover:bg-kemu-purple/5'} transition-colors`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isExpired(vacancy.deadline) ? 'bg-red-200' : 'bg-kemu-purple/20'}`}>
                                            <Calendar size={16} className={isExpired(vacancy.deadline) ? 'text-red-600' : 'text-kemu-purple'} />
                                        </div>
                                        <span className={`font-semibold ${isExpired(vacancy.deadline) ? 'text-red-600' : 'text-gray-700'}`}>
                                            {isExpired(vacancy.deadline) ? 'Expired: ' : 'Due: '}{formatDate(vacancy.deadline)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 py-3.5 bg-gradient-to-r from-kemu-purple to-kemu-blue text-white rounded-xl font-bold hover:from-kemu-purple/90 hover:to-kemu-blue/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-md group-hover:shadow-lg">
                                        View Details
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    {!isExpired(vacancy.deadline) && (
                                        <Link
                                            to={`/apply/${vacancy.slug}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-6 py-3.5 bg-gradient-to-r from-kemu-gold to-yellow-500 text-gray-900 rounded-xl font-bold hover:from-kemu-gold/90 hover:to-yellow-400 transition-all duration-300 shadow-md"
                                        >
                                            Apply
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 animate-fade-up">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Briefcase size={48} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Vacancies Available</h3>
                        <p className="text-gray-500 text-lg">Check back later for new opportunities</p>
                    </div>
                )}
            </div>

            {/* Vacancy Detail Modal */}
            {selectedVacancy && (
                <Modal isOpen={!!selectedVacancy} onClose={() => setSelectedVacancy(null)} title={selectedVacancy.title}>
                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedVacancy.type === 'Academic' ? 'bg-kemu-purple/20 text-kemu-purple' :
                                selectedVacancy.type === 'Administrative' ? 'bg-kemu-blue/20 text-kemu-blue' :
                                    'bg-kemu-gold/20 text-kemu-gold'
                                }`}>
                                {selectedVacancy.type}
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                                {selectedVacancy.department}
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                                {selectedVacancy.location}
                            </span>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-kemu-purple mb-2">Description</h3>
                            <p className="text-gray-700 whitespace-pre-line">{selectedVacancy.description}</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-kemu-purple mb-2">Requirements</h3>
                            <p className="text-gray-700 whitespace-pre-line">{selectedVacancy.requirements}</p>
                        </div>

                        <div className="bg-kemu-purple/10 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-kemu-purple">
                                Application Deadline: {formatDate(selectedVacancy.deadline)}
                            </p>
                            {isExpired(selectedVacancy.deadline) && (
                                <p className="text-sm text-red-600 mt-1">This vacancy has expired</p>
                            )}
                        </div>

                        {isExpired(selectedVacancy.deadline) ? (
                            <div className="bg-red-50 p-4 rounded-lg text-center">
                                <p className="text-red-700 font-semibold">This position is no longer accepting applications</p>
                            </div>
                        ) : (
                            <Link
                                to={`/apply/${selectedVacancy.slug}`}
                                className="block w-full py-4 bg-gradient-to-r from-kemu-gold to-yellow-500 text-gray-900 text-center rounded-xl font-bold hover:from-kemu-gold/90 hover:to-yellow-400 transition-all duration-300 shadow-lg"
                            >
                                Apply Now
                            </Link>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Careers;
