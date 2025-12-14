// Application Constants

export const DEBOUNCE_DELAY = 300; // milliseconds
export const API_TIMEOUT = 10000; // 10 seconds

// Mock data toggle - should be false in production
export const USE_MOCK = false;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Admin credentials (should be moved to environment variables in production)
export const DEFAULT_ADMIN_USERNAME = 'admin';
export const DEFAULT_ADMIN_PASSWORD = 'admin';

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'kemu_token',
  USER: 'kemu_user',
} as const;

// Pagination
export const ITEMS_PER_PAGE = 12;
export const NEWS_ITEMS_PER_PAGE = 9;

// Image placeholders
export const PLACEHOLDER_IMAGE = 'https://picsum.photos/800/600';
export const PLACEHOLDER_IMAGE_SEED = (id: number) => `https://picsum.photos/seed/${id}/800/600`;

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  ISO: 'yyyy-MM-dd',
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TITLE_LENGTH: 200,
  MAX_CONTENT_LENGTH: 10000,
} as const;

