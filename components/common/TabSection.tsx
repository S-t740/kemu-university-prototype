import React, { useState } from 'react';

/**
 * TabSection Component - Tabbed interface for organizing content
 * Allows switching between different content sections
 */

export interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ElementType;
}

interface TabSectionProps {
    tabs: Tab[];
    defaultTab?: string;
    activeTabId?: string;
    onTabChange?: (tabId: string) => void;
    className?: string;
}

const TabSection: React.FC<TabSectionProps> = ({
    tabs,
    defaultTab,
    activeTabId,
    onTabChange,
    className = ''
}) => {
    const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id);

    // Use controlled state if activeTabId is provided, otherwise use internal state
    const currentTabId = activeTabId !== undefined ? activeTabId : internalActiveTab;

    const handleTabClick = (tabId: string) => {
        if (onTabChange) {
            onTabChange(tabId);
        } else {
            setInternalActiveTab(tabId);
        }
    };

    const activeTabContent = tabs.find(tab => tab.id === currentTabId)?.content;

    return (
        <div className={`w-full ${className}`}>
            {/* Tab Headers */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTabId === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`
                                flex items-center gap-2 px-6 py-3 font-semibold text-sm md:text-base
                                transition-all duration-300 border-b-2
                                ${isActive
                                    ? 'text-kemu-purple border-kemu-gold'
                                    : 'text-gray-600 border-transparent hover:text-kemu-purple hover:border-gray-300'
                                }
                            `}
                        >
                            {Icon && <Icon size={20} />}
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTabContent}
            </div>
        </div>
    );
};

export default TabSection;
