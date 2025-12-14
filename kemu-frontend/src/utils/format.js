/**
 * Formatting utilities
 */

export const formatDate = (dateString, format = 'short') => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString;
  }

  const options = {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};


