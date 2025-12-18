import React, { useState, useEffect } from 'react';
import { getDirectorates, createDirectorate, updateDirectorate, deleteDirectorate } from '../services/api';
import { Directorate } from '../types';
import { Plus, Edit, Trash2, Save, X, AlertCircle, Building } from 'lucide-react';
import { createSlug } from '../utils';

const DirectoratesManagement: React.FC = () => {
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        overview: ''
    });

    const fetchDirectorates = async () => {
        try {
            setLoading(true);
            const data = await getDirectorates();
            setDirectorates(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch directorates');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDirectorates();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            overview: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (directorate: Directorate) => {
        setFormData({
            name: directorate.name,
            overview: directorate.overview || ''
        });
        setEditingId(directorate.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const slug = createSlug(formData.name);
            const payload = {
                name: formData.name,
                slug,
                overview: formData.overview
            };

            if (editingId) {
                await updateDirectorate(editingId, payload);
            } else {
                await createDirectorate(payload);
            }

            resetForm();
            fetchDirectorates();
        } catch (err: any) {
            setError(err.message || 'Failed to save directorate');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await deleteDirectorate(id);
            fetchDirectorates();
        } catch (err: any) {
            setError(err.message || 'Failed to delete directorate');
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading directorates...</div>;
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
                        {editingId ? 'Edit Directorate' : 'Add New Directorate'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-kemu-purple focus:border-transparent"
                                placeholder="e.g., Directorate of Research and Innovation"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                            <textarea
                                value={formData.overview}
                                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-kemu-purple focus:border-transparent"
                                rows={4}
                                placeholder="Describe the directorate's role and responsibilities..."
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 px-4 py-2 bg-kemu-gold text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                            >
                                <Save size={18} />
                                {submitting ? 'Saving...' : editingId ? 'Update Directorate' : 'Create Directorate'}
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
                    className="flex items-center gap-2 px-4 py-2 bg-kemu-gold text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                    <Plus size={18} />
                    Add New Directorate
                </button>
            )}

            {/* Directorates List */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-kemu-gold/10 to-kemu-purple/10">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Building size={20} className="text-kemu-gold" />
                        Directorates ({directorates.length})
                    </h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {directorates.map((directorate) => (
                        <div key={directorate.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-gray-900">{directorate.name}</h4>
                                    <span className="text-xs text-kemu-gold bg-kemu-gold/10 px-2 py-1 rounded">{directorate.slug}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{directorate.overview || 'No overview provided'}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <button
                                    onClick={() => handleEdit(directorate)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(directorate.id, directorate.name)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {directorates.length === 0 && (
                        <div className="px-6 py-8 text-center text-gray-500">
                            No directorates found. Click "Add New Directorate" to create one.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DirectoratesManagement;
