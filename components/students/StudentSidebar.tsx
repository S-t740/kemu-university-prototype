import React from 'react';
import { StudentService } from '../../services/api';

interface StudentSidebarProps {
    categories: StudentService[];
    activeCategory: string;
    onSelectCategory: (slug: string) => void;
    loading?: boolean;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({
    categories,
    activeCategory,
    onSelectCategory,
    loading = false
}) => {
    // Add static portals category at the end
    const allCategories = [
        ...categories.map(c => ({ id: c.slug, label: c.title })),
        { id: 'portals', label: 'Student Portals' }
    ];

    return (
        <div className="w-full md:w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)]">
            <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-serif font-bold text-kemu-blue">Student Services</h3>
            </div>
            <nav className="p-2 space-y-1">
                {loading ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : (
                    allCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id)}
                            className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${activeCategory === category.id
                                ? 'bg-kemu-blue text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-kemu-blue'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))
                )}
            </nav>
        </div>
    );
};

export default StudentSidebar;
