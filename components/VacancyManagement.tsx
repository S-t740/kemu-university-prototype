import React, { useState } from 'react';
import { Vacancy } from '../types';
import { createVacancy, updateVacancy } from '../services/api';
import { createSlug, formatDate, handleApiError } from '../utils';
import { API_BASE_URL } from '../constants';
import { X, Edit, Trash2 } from 'lucide-react';
import { InputField, GlassSection, GoldButton } from '../components';
import axios from 'axios';

interface VacancyManagementProps {
    vacancies: Vacancy[];
    onRefreshData: () => Promise<void>;
    onEditClick: (type: string, item: any) => void;
    onDeleteClick: (type: string, id: number, title: string) => void;
    editMode: { type: string | null; id: number | null };
    setEditMode: React.Dispatch<React.SetStateAction<{ type: string | null; id: number | null }>>;
    token: string | null;
}

const VacancyManagement: React.FC<VacancyManagementProps> = ({
    vacancies,
    onRefreshData,
    onEditClick,
    onDeleteClick,
    editMode,
    setEditMode,
    token
}) => {
    const [newVacancy, setNewVacancy] = useState({
        title: '', department: '', location: '', type: '', description: '', requirements: '', deadline: ''
    });
    const [vacancyErrors, setVacancyErrors] = useState<Record<string, string>>({});
    const [vacancySubmitting, setVacancySubmitting] = useState(false);
    const [vacancyImages, setVacancyImages] = useState<File[]>([]);
    const [vacancyImagePreviews, setVacancyImagePreviews] = useState<string[]>([]);
    const [vacancyExistingImages, setVacancyExistingImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleVacancyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newFiles = Array.from(files);
        const totalImages = vacancyImages.length + vacancyExistingImages.length + newFiles.length;
        if (totalImages > 5) {
            setError('Maximum 5 images allowed');
            return;
        }
        setVacancyImages(prev => [...prev, ...newFiles]);
        const previews = newFiles.map(file => URL.createObjectURL(file));
        setVacancyImagePreviews(prev => [...prev, ...previews]);
    };

    const removeVacancyImage = (index: number, isExisting: boolean) => {
        if (isExisting) {
            setVacancyExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            const newIndex = index - vacancyExistingImages.length;
            setVacancyImages(prev => prev.filter((_, i) => i !== newIndex));
            setVacancyImagePreviews(prev => prev.filter((_, i) => i !== newIndex));
        }
    };

    const handleCreateVacancy = async (e: React.FormEvent) => {
        e.preventDefault();
        setVacancyErrors({});
        setVacancySubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', newVacancy.title);
            formData.append('slug', createSlug(newVacancy.title));
            formData.append('department', newVacancy.department);
            formData.append('location', newVacancy.location);
            formData.append('type', newVacancy.type);
            formData.append('description', newVacancy.description);
            formData.append('requirements', newVacancy.requirements);
            formData.append('deadline', newVacancy.deadline);

            if (editMode.type === 'vacancy' && editMode.id && vacancyExistingImages.length > 0) {
                formData.append('existingImages', JSON.stringify(vacancyExistingImages));
            }

            vacancyImages.forEach(file => {
                formData.append('images', file);
            });

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };

            if (editMode.type === 'vacancy' && editMode.id) {
                await axios.put(`${API_BASE_URL}/vacancies/${editMode.id}`, formData, config);
            } else {
                await axios.post(`${API_BASE_URL}/vacancies`, formData, config);
            }

            setNewVacancy({ title: '', department: '', location: '', type: '', description: '', requirements: '', deadline: '' });
            setEditMode({ type: null, id: null });
            setVacancyImages([]);
            setVacancyImagePreviews([]);
            setVacancyExistingImages([]);
            await onRefreshData();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setVacancySubmitting(false);
        }
    };

    // Populate form when editing
    React.useEffect(() => {
        if (editMode.type === 'vacancy' && editMode.id) {
            const vacancy = vacancies.find(v => v.id === editMode.id);
            if (vacancy) {
                setNewVacancy({
                    title: vacancy.title,
                    department: vacancy.department,
                    location: vacancy.location,
                    type: vacancy.type,
                    description: vacancy.description,
                    requirements: vacancy.requirements,
                    deadline: new Date(vacancy.deadline).toISOString().split('T')[0]
                });
                setVacancyExistingImages(vacancy.images || []);
            }
        }
    }, [editMode, vacancies]);

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                    <button onClick={() => setError(null)} className="float-right">&times;</button>
                </div>
            )}

            <GlassSection title={editMode.type === 'vacancy' && editMode.id ? 'Edit Vacancy' : 'Create New Vacancy'}>
                <form onSubmit={handleCreateVacancy} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Job Title"
                            value={newVacancy.title}
                            onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
                            error={vacancyErrors.title}
                            required
                            placeholder="e.g., Lecturer in Computer Science"
                        />
                        <InputField
                            label="Department"
                            value={newVacancy.department}
                            onChange={(e) => setNewVacancy({ ...newVacancy, department: e.target.value })}
                            error={vacancyErrors.department}
                            required
                            placeholder="e.g., School of Computing"
                        />
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                            <select
                                value={newVacancy.location}
                                onChange={(e) => setNewVacancy({ ...newVacancy, location: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold transition-all"
                                required
                            >
                                <option value="">Select Location</option>
                                <option value="Meru Campus">Meru Campus</option>
                                <option value="Nairobi Campus">Nairobi Campus</option>
                                <option value="Mombasa Campus">Mombasa Campus</option>
                                <option value="All Campuses">All Campuses</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                            <select
                                value={newVacancy.type}
                                onChange={(e) => setNewVacancy({ ...newVacancy, type: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold transition-all"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="Academic">Academic</option>
                                <option value="Administrative">Administrative</option>
                                <option value="Support Staff">Support Staff</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <InputField
                            label="Application Deadline"
                            type="date"
                            value={newVacancy.deadline}
                            onChange={(e) => setNewVacancy({ ...newVacancy, deadline: e.target.value })}
                            error={vacancyErrors.deadline}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
                        <textarea
                            value={newVacancy.description}
                            onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold transition-all"
                            rows={4}
                            required
                            placeholder="Detailed job description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements *</label>
                        <textarea
                            value={newVacancy.requirements}
                            onChange={(e) => setNewVacancy({ ...newVacancy, requirements: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold transition-all"
                            rows={4}
                            required
                            placeholder="Required qualifications..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Images (Optional, max 5)</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleVacancyImageChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                        />
                        {(vacancyImagePreviews.length > 0 || vacancyExistingImages.length > 0) && (
                            <div className="mt-4 grid grid-cols-5 gap-4">
                                {vacancyExistingImages.map((img, index) => (
                                    <div key={`existing-${index}`} className="relative group">
                                        <img src={`http://localhost:4000${img}`} alt={`Existing ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => removeVacancyImage(index, true)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                {vacancyImagePreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative group">
                                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => removeVacancyImage(vacancyExistingImages.length + index, false)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <GoldButton type="submit" disabled={vacancySubmitting}>
                            {vacancySubmitting ? 'Saving...' : (editMode.type === 'vacancy' && editMode.id ? 'Update Vacancy' : 'Create Vacancy')}
                        </GoldButton>
                        {editMode.type === 'vacancy' && editMode.id && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditMode({ type: null, id: null });
                                    setNewVacancy({ title: '', department: '', location: '', type: '', description: '', requirements: '', deadline: '' });
                                    setVacancyImages([]);
                                    setVacancyImagePreviews([]);
                                    setVacancyExistingImages([]);
                                }}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </GlassSection>

            <GlassSection title="All Vacancies">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-kemu-purple/10 to-kemu-blue/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Position</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Department</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Location</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Deadline</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/50 divide-y divide-gray-100">
                            {vacancies.map((vacancy) => (
                                <tr key={vacancy.id} className="hover:bg-white/80 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{vacancy.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{vacancy.department}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{vacancy.location}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${vacancy.type === 'Academic' ? 'bg-purple-100 text-purple-800' :
                                                vacancy.type === 'Administrative' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                            }`}>{vacancy.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm ${new Date(vacancy.deadline) < new Date() ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                            {formatDate(vacancy.deadline)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEditClick('vacancy', vacancy)}
                                                className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDeleteClick('vacancy', vacancy.id, vacancy.title)}
                                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {vacancies.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No vacancies posted yet. Create your first job posting above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassSection>
        </div>
    );
};

export default VacancyManagement;
