import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * AccordionSection Component - Expandable/collapsible content sections
 * Useful for FAQ-style content or collapsible lists
 */

export interface AccordionItem {
    id: string;
    title: string;
    content: React.ReactNode;
    icon?: React.ElementType;
}

interface AccordionSectionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    defaultOpen?: string[];
    className?: string;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
    items,
    allowMultiple = false,
    defaultOpen = [],
    className = ''
}) => {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

    const toggleItem = (id: string) => {
        if (allowMultiple) {
            setOpenItems(prev =>
                prev.includes(id)
                    ? prev.filter(item => item !== id)
                    : [...prev, id]
            );
        } else {
            setOpenItems(prev =>
                prev.includes(id) ? [] : [id]
            );
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {items.map((item) => {
                const isOpen = openItems.includes(item.id);
                const Icon = item.icon;

                return (
                    <div
                        key={item.id}
                        className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl overflow-hidden shadow-soft-3d hover:shadow-deep-3d transition-all duration-300"
                    >
                        {/* Header */}
                        <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/20 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {Icon && (
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-kemu-purple/20 to-kemu-gold/20">
                                        <Icon size={20} className="text-kemu-purple" />
                                    </div>
                                )}
                                <h3 className="text-lg md:text-xl font-serif font-bold text-kemu-purple">
                                    {item.title}
                                </h3>
                            </div>
                            {isOpen ? (
                                <ChevronUp size={24} className="text-kemu-gold flex-shrink-0" />
                            ) : (
                                <ChevronDown size={24} className="text-gray-400 flex-shrink-0" />
                            )}
                        </button>

                        {/* Content */}
                        {isOpen && (
                            <div className="px-6 pb-6 animate-slide-up-fade">
                                {item.content}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AccordionSection;
