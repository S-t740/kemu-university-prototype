import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'image' | 'list';
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 1,
  className = '',
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ${className}`}>
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>
          </div>
        );
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
          </div>
        );
      case 'image':
        return (
          <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} style={{ aspectRatio: '16/9' }} />
        );
      case 'list':
        return (
          <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 ${className}`}>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        );
      default:
        return <div className={`h-64 bg-gray-200 rounded-lg animate-pulse ${className}`} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default LoadingSkeleton;

