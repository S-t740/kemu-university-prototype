import React, { useState, useEffect } from 'react';
import { getStudentServices, createStudentService, updateStudentService, deleteStudentService, StudentService } from '../services/api';
import { Plus, Edit, Trash2, Save, X, AlertCircle } from 'lucide-react';

const StudentServicesManagement: React.FC = () => {
    const [services, setServices] = useState<StudentService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        summary: '',
        details: '',
        url: '',
        sortOrder: 0,
        isActive: true
    });

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await getStudentServices();
            setServices(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const resetForm = () => {
        setFormData({
            slug: '',
            title: '',
            summary: '',
            details: '',
            url: '',
            sortOrder: 0,
            isActive: true
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (service: StudentService) => {
        setFormData({
            slug: service.slug,
            title: service.title,
            summary: service.summary,
            details: service.details.join('\n'),
            url: service.url || '',
            sortOrder: service.sortOrder,
            isActive: service.isActive
        });
        setEditingId(service.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const payload = {
                ...formData,
                details: formData.details.split('\n').filter(d => d.trim() !== '')
            };

            if (editingId) {
                await updateStudentService(editingId, payload);
            } else {
                await createStudentService(payload);
            }

            resetForm();
            fetchServices();
        } catch (err: any) {
            setError(err.message || 'Failed to save service');
        }
    };

    const handleDelete = async (id: number, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await deleteStudentService(id);
            fetchServices();
        } catch (err: any) {
            setError(err.message || 'Failed to delete service');
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading student services...</div>;
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded flex items-center gap-2">
                    <AlertCircle size={18} />
                    {error}
                    <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {editingId ? 'Edit Student Service' : 'Add New Student Service'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (ID)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-kemu-purple focus:border-transparent"
                                    placeholder="e.g., welfare, counselling"
                                    required
                                    disabled={!!editingId}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-kemu-purple focus:border-transparent"
                                    placeholder="Display title"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                            <textarea
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-kemu-purple focus:border-transparent"
                                rows={3}
                                placeholder="Main description"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Details (one per line)</label>
                            <textarea
                                value={formData.details}
                                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-kemu-purple focus:border-transparent font-mono text-sm"
                                rows={5}
                                placeholder="Enter each detail point on a new line"
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL (optional)</label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-kemu-purple focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                <input
                                    type="number"
                                    value={formData.sortOrder}
                                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-kemu-purple focus:border-transparent"
                                />
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-kemu-purple border-gray-300 rounded focus:ring-kemu-purple"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 bg-kemu-purple text-white rounded-lg hover:bg-purple-800 transition-colors"
                            >
                                <Save size={18} />
                                {editingId ? 'Update Service' : 'Create Service'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Add Button */}
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-kemu-purple text-white rounded-lg hover:bg-purple-800 transition-colors"
                >
                    <Plus size={18} />
                    Add New Service
                </button>
            )}

            {/* Services List */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">Student Services ({services.length})</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {services.map((service) => (
                        <div key={service.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-gray-900">{service.title}</h4>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{service.slug}</span>
                                    {!service.isActive && (
                                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Inactive</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.summary}</p>
                                <div className="text-xs text-gray-400 mt-1">
                                    {service.details.length} details • Sort: {service.sortOrder}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id, service.title)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {services.length === 0 && (
                        <div className="px-6 py-8 text-center text-gray-500">
                            No student services found. Click "Add New Service" to create one.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentServicesManagement;
