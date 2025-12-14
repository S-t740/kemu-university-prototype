import React from 'react';
import { StudentService } from '../../services/api';
import kemuContent from '../../kemu_content.json';

interface StudentContentProps {
    activeCategory: string;
    services: StudentService[];
    loading?: boolean;
}

const StudentContent: React.FC<StudentContentProps> = ({ activeCategory, services, loading = false }) => {
    // Find the current service from API data
    const currentService = services.find(s => s.slug === activeCategory);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="text-gray-500">Loading content...</div>
            </div>
        );
    }

    // Special case for portals (static content from kemuContent)
    if (activeCategory === 'portals') {
        const portals = kemuContent.portals || [];
        return (
            <div className="space-y-6 animate-fadeIn">
                <h2 className="text-3xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-4">Student Portals</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {portals.map((portal: any, index: number) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-serif font-bold text-kemu-blue mb-2">{portal.title}</h3>
                            <p className="text-gray-600 mb-4 text-sm line-clamp-3">{portal.summary}</p>
                            <a
                                href={portal.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-kemu-gold font-bold text-sm hover:underline"
                            >
                                Access Portal &rarr;
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!currentService) {
        return (
            <div className="text-center py-12 text-gray-500">
                Select a category to view content.
            </div>
        );
    }

    // Render dynamic content from API
    const renderServiceContent = () => {
        const details = currentService.details || [];

        // Special formatting based on service slug
        switch (currentService.slug) {
            case 'welfare':
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-4">{currentService.title}</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">{currentService.summary}</p>

                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                            <h3 className="text-xl font-bold text-kemu-blue mb-4 font-serif">Available Support Services</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {details.map((detail: string, index: number) => {
                                    const [title, desc] = detail.includes(' - ') ? detail.split(' - ') : [detail, ''];
                                    return (
                                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
                                            {desc && <p className="text-sm text-gray-600">{desc}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );

            case 'counselling':
                // Parse counsellors and hotlines
                const nairobiCounsellors = details.find((d: string) => d.includes('Nairobi Campus counsellors'));
                const mainCounsellors = details.find((d: string) => d.includes('Main Campus counsellors'));
                const hotlines = details.find((d: string) => d.includes('Toll-free'));
                const otherDetails = details.filter((d: string) =>
                    !d.includes('counsellors') && !d.includes('Toll-free') && !d.includes('CONFIDENTIAL')
                );

                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-4">{currentService.title}</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">{currentService.summary}</p>

                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                            <h3 className="text-xl font-bold text-kemu-blue mb-4 font-serif">Our Services</h3>
                            <ul className="space-y-2 list-disc pl-5 text-gray-700">
                                {otherDetails.map((detail: string, index: number) => (
                                    <li key={index}>{detail}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {mainCounsellors && (
                                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                    <h4 className="font-bold text-kemu-purple mb-3">🏛️ Main Campus (Meru)</h4>
                                    <p className="text-sm text-gray-600">{mainCounsellors.replace('Main Campus counsellors: ', '')}</p>
                                </div>
                            )}
                            {nairobiCounsellors && (
                                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                    <h4 className="font-bold text-kemu-purple mb-3">🏙️ Nairobi Campus</h4>
                                    <p className="text-sm text-gray-600">{nairobiCounsellors.replace('Nairobi Campus counsellors: ', '')}</p>
                                </div>
                            )}
                        </div>

                        {hotlines && (
                            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                                <h4 className="font-bold text-red-800 mb-3">🆘 Crisis Support Hotlines</h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <div className="bg-white p-3 rounded border border-red-100">
                                        <span className="font-semibold text-gray-900">Child Line Kenya:</span> <span className="text-red-700">116</span>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-red-100">
                                        <span className="font-semibold text-gray-900">RedCross GBV/Crisis:</span> <span className="text-red-700">1199</span>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-red-100">
                                        <span className="font-semibold text-gray-900">Niskize Suicide Prevention:</span> <span className="text-red-700">0900620800</span>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-red-100">
                                        <span className="font-semibold text-gray-900">NACADA (Substance Abuse):</span> <span className="text-red-700">1192</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                            <p className="text-green-800 font-medium">🔒 All information shared during counselling is CONFIDENTIAL</p>
                            <p className="text-sm text-green-700 mt-1">(unless there is a proven threat to life)</p>
                        </div>
                    </div>
                );

            case 'timetables':
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-4">{currentService.title}</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">{currentService.summary}</p>

                        {details.length > 0 && (
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">Available Schedules</h3>
                                <ul className="grid md:grid-cols-2 gap-3">
                                    {details.map((detail: string, i: number) => (
                                        <li key={i} className="flex items-center bg-white p-3 rounded border border-gray-200">
                                            <span className="text-kemu-gold mr-2">📅</span>
                                            <span className="text-gray-700">{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {currentService.url && (
                            <div className="bg-kemu-blue/10 p-6 rounded-lg border border-kemu-blue/20 text-center">
                                <p className="mb-4 text-gray-700">Access your class and exam schedules on the official portal.</p>
                                <a href={currentService.url} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-kemu-blue text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm">
                                    View Timetables Portal →
                                </a>
                            </div>
                        )}
                    </div>
                );

            case 'booklets':
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-4">{currentService.title}</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">{currentService.summary}</p>

                        <div className="bg-gradient-to-r from-kemu-purple/10 to-kemu-gold/10 p-8 rounded-xl border border-kemu-gold/30 text-center">
                            <div className="text-5xl mb-4">📚</div>
                            <h3 className="text-xl font-bold text-kemu-purple mb-3">Access Graduation Booklets</h3>
                            <p className="text-gray-600 mb-6">Download official graduation ceremony booklets containing graduating class information and ceremony details.</p>
                            <a
                                href={currentService.url || 'https://kemu.ac.ke/graduation-booklets'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-8 py-3 bg-kemu-purple text-white rounded-lg font-medium hover:bg-purple-800 transition-colors shadow-md"
                            >
                                View Graduation Booklets →
                            </a>
                        </div>
                    </div>
                );

            default:
                // Generic rendering for other services
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-4">{currentService.title}</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">{currentService.summary}</p>

                        {details.length > 0 && (
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-kemu-blue mb-4 font-serif">Details</h3>
                                <ul className="space-y-2 list-disc pl-5 text-gray-700">
                                    {details.map((detail: string, index: number) => (
                                        <li key={index}>{detail}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {currentService.url && (
                            <div className="bg-kemu-blue/10 p-6 rounded-lg border border-kemu-blue/20 text-center">
                                <a href={currentService.url} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-kemu-blue text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm">
                                    Learn More →
                                </a>
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {renderServiceContent()}
        </div>
    );
};

export default StudentContent;
