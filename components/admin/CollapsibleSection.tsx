import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
    title: string;
    count: number;
    icon?: React.ReactNode;
    defaultOpen?: boolean;
    colorClass?: string;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    count,
    icon,
    defaultOpen = false,
    colorClass = 'bg-kemu-purple',
    children
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 shadow-soft-3d">
            {/* Collapsible Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-white hover:from-kemu-purple10 hover:to-kemu-purple10/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:ring-inset`}
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className={`p-2 rounded-lg ${colorClass}/10`}>
                            {icon}
                        </div>
                    )}
                    <div className="text-left">
                        <h3 className="text-base font-bold text-gray-800 font-serif">{title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{count} {count === 1 ? 'item' : 'items'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${colorClass}`}>
                        {count}
                    </span>
                    {isOpen ? (
                        <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                    )}
                </div>
            </button>

            {/* Collapsible Content */}
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CollapsibleSection;
