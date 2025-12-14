import { z } from 'zod';
import { VALIDATION } from '../constants';

// Program validation schema
export const programSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(VALIDATION.MAX_TITLE_LENGTH, `Title must be less than ${VALIDATION.MAX_TITLE_LENGTH} characters`),
  degreeType: z.enum(['Undergraduate', 'Postgraduate', 'Certificate']),
  schoolId: z.string().min(1, 'School is required'),
  duration: z.string().min(1, 'Duration is required'),
  overview: z
    .string()
    .min(10, 'Overview must be at least 10 characters')
    .max(VALIDATION.MAX_CONTENT_LENGTH, `Overview must be less than ${VALIDATION.MAX_CONTENT_LENGTH} characters`),
});

// News validation schema
export const newsSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(VALIDATION.MAX_TITLE_LENGTH, `Title must be less than ${VALIDATION.MAX_TITLE_LENGTH} characters`),
  summary: z
    .string()
    .min(10, 'Summary must be at least 10 characters')
    .max(500, 'Summary must be less than 500 characters'),
  content: z
    .string()
    .min(20, 'Content must be at least 20 characters')
    .max(VALIDATION.MAX_CONTENT_LENGTH, `Content must be less than ${VALIDATION.MAX_CONTENT_LENGTH} characters`),
  author: z.string().min(1, 'Author is required'),
});

// Login validation schema
export const loginSchema = z.object({
  username: z.string().min(1, 'Email is required').email('Invalid email address').or(z.string().min(1, 'Username is required')), // Allow both for flex or just email
  password: z.string().min(1, 'Password is required'),
});

export type ProgramFormData = z.infer<typeof programSchema>;
export type NewsFormData = z.infer<typeof newsSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SchoolFormData = z.infer<typeof schoolSchema>;
export type EventFormData = z.infer<typeof eventSchema>;

// School validation schema
export const schoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  overview: z.string().optional(),
});

// Event validation schema
export const eventSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(VALIDATION.MAX_TITLE_LENGTH, `Title must be less than ${VALIDATION.MAX_TITLE_LENGTH} characters`),
  date: z.string().min(1, 'Date is required'),
  venue: z.string().min(1, 'Venue is required'),
  details: z.string().optional(),
});

