import { z } from 'zod';

export const MAX_BIO_LENGTH = 500;
export const MAX_SKILLS = 50;

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  profession: z.string().trim().max(100, 'Profession must be at most 100 characters'),
  company: z.string().trim().max(100, 'Company must be at most 100 characters'),
  experience: z
    .number('Enter a number')
    .int('Experience must be a whole number')
    .min(0, 'Experience cannot be negative')
    .max(80, 'Experience must be at most 80 years'),
  bio: z.string().trim().max(MAX_BIO_LENGTH, `Bio must be at most ${MAX_BIO_LENGTH} characters`),
  skills: z.array(z.string().trim().min(1)).max(MAX_SKILLS, `You can add up to ${MAX_SKILLS} skills`),
});

export const AVATAR_ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const AVATAR_MAX_SIZE = 5 * 1024 * 1024;
