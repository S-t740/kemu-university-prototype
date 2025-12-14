import React, { useState, useEffect } from 'react';
import { getInquiries, toggleInquiryRead, deleteInquiry } from '../services/api';
import { Mail, MailOpen, Trash2, Eye, Search, Filter, MessageSquare, X } from 'lucide-react';

interface Inquiry {
    id: number;
    name: string;
    email: string;
    message: string;
    source: string;
    isRead: boolean;
    createdAt: string;
}

const Inbox: React.FC = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'unread' | 'chatbot' | 'contact'>('all');

    useEffect(() => {
        fetchInquiries();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [inquiries, searchTerm, filterType]);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const data = await getInquiries();
            setInquiries(data);
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...inquiries];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (inq) =>
                    inq.name.toLowerCase().includes(term) ||
                    inq.email.toLowerCase().includes(term) ||
                    inq.message.toLowerCase().includes(term)
            );
        }

        // Apply type filter
        if (filterType === 'unread') {
            result = result.filter((inq) => !inq.isRead);
        } else if (filterType === 'chatbot') {
            result = result.filter((inq) => inq.source === 'chatbot');
        } else if (filterType === 'contact') {
            result = result.filter((inq) => inq.source === 'contact-form' || inq.source === 'contact');
        }

        setFilteredInquiries(result);
    };

    const handleToggleRead = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await toggleInquiryRead(id);
            await fetchInquiries();
        } catch (error) {
            console.error('Failed to toggle read status:', error);
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this inquiry?')) return;

        try {
            await deleteInquiry(id);
            await fetchInquiries();
            if (selectedInquiry?.id === id) {
                setSelectedInquiry(null);
            }
        } catch (error) {
            console.error('Failed to delete inquiry:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const unreadCount = inquiries.filter((inq) => !inq.isRead).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-serif">Inbox</h1>
                            <p className="text-gray-600 mt-1">
                                Manage inquiries from chatbot and contact forms
                            </p>
                        </div>
                        <div className="bg-gradient-to-r from-kemu-purple to-kemu-blue text-white px-6 py-3 rounded-xl shadow-lg">
                            <div className="text-center">
                                <p className="text-sm opacity-90">Unread</p>
                                <p className="text-2xl font-bold">{unreadCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or message..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                            >
                                <option value="all">All Inquiries</option>
                                <option value="unread">Unread Only</option>
                                <option value="chatbot">Chatbot</option>
                                <option value="contact">Contact Form</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 border-4 border-kemu-purple/30 border-t-kemu-purple rounded-full animate-spin mx-auto"></div>
                            <p className="text-gray-500 mt-4">Loading inquiries...</p>
                        </div>
                    ) : filteredInquiries.length === 0 ? (
                        <div className="p-12 text-center">
                            <MessageSquare className="mx-auto text-gray-300 mb-4" size={64} />
                            <p className="text-gray-500 font-medium">No inquiries found</p>
                            <p className="text-sm text-gray-400 mt-1">
                                {searchTerm || filterType !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Inquiries from the chatbot and contact form will appear here'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-purple-50/50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Source
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredInquiries.map((inquiry) => (
                                        <tr
                                            key={inquiry.id}
                                            className={`hover:bg-purple-50/30 transition-colors cursor-pointer ${!inquiry.isRead ? 'bg-purple-50/20' : ''
                                                }`}
                                            onClick={() => setSelectedInquiry(inquiry)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {inquiry.isRead ? (
                                                    <MailOpen className="text-gray-400" size={20} />
                                                ) : (
                                                    <Mail className="text-kemu-purple" size={20} />
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-medium ${!inquiry.isRead ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                    {inquiry.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{inquiry.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${inquiry.source === 'chatbot'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}
                                                >
                                                    {inquiry.source === 'chatbot' ? '💬 Chatbot' : '📧 Contact'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-500">{formatDate(inquiry.createdAt)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedInquiry(inquiry)}
                                                        className="p-2 bg-kemu-gold/10 hover:bg-kemu-gold/20 text-kemu-gold rounded-lg transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleToggleRead(inquiry.id, e)}
                                                        className="p-2 bg-kemu-purple/10 hover:bg-kemu-purple/20 text-kemu-purple rounded-lg transition-colors"
                                                        title={inquiry.isRead ? 'Mark as unread' : 'Mark as read'}
                                                    >
                                                        {inquiry.isRead ? <Mail size={16} /> : <MailOpen size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(inquiry.id, e)}
                                                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Results count */}
                {!loading && filteredInquiries.length > 0 && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Showing {filteredInquiries.length} of {inquiries.length} inquiries
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-kemu-purple to-kemu-blue p-6 text-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{selectedInquiry.name}</h2>
                                    <a
                                        href={`mailto:${selectedInquiry.email}`}
                                        className="text-white/90 hover:text-white underline text-sm"
                                    >
                                        {selectedInquiry.email}
                                    </a>
                                </div>
                                <button
                                    onClick={() => setSelectedInquiry(null)}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedInquiry.source === 'chatbot'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-white/20 text-white'
                                        }`}
                                >
                                    {selectedInquiry.source === 'chatbot' ? '💬 Chatbot' : '📧 Contact Form'}
                                </span>
                                <span className="text-white/80 text-sm">{formatDate(selectedInquiry.createdAt)}</span>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                                Message
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                    {selectedInquiry.message}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                            <a
                                href={`mailto:${selectedInquiry.email}?subject=Re: Your inquiry&body=Hi ${selectedInquiry.name},%0D%0A%0D%0A`}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-kemu-gold to-kemu-gold/90 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                            >
                                <Mail size={18} />
                                Reply via Email
                            </a>
                            <button
                                onClick={(e) => {
                                    handleToggleRead(selectedInquiry.id, e);
                                    setSelectedInquiry(null);
                                }}
                                className="px-4 py-3 bg-kemu-purple/10 hover:bg-kemu-purple/20 text-kemu-purple rounded-xl transition-colors font-medium"
                            >
                                Mark as {selectedInquiry.isRead ? 'Unread' : 'Read'}
                            </button>
                            <button
                                onClick={(e) => {
                                    handleDelete(selectedInquiry.id, e);
                                    setSelectedInquiry(null);
                                }}
                                className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inbox;
