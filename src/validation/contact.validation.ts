import { z } from 'zod';

export const CONTACT_TOPICS = [
  { value: 'general', label: 'General question' },
  { value: 'payment', label: 'Payments and orders' },
  { value: 'evaluator', label: 'Publishing as an evaluator' },
  { value: 'account', label: 'Account and login' },
  { value: 'feedback', label: 'Feedback or bug report' },
] as const;

export const MAX_MESSAGE_LENGTH = 2000;

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100, 'Name must be at most 100 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  topic: z.enum(CONTACT_TOPICS.map((t) => t.value) as [string, ...string[]], 'Choose a topic'),
  message: z
    .string()
    .trim()
    .min(20, 'Please write at least 20 characters so we can help')
    .max(MAX_MESSAGE_LENGTH, `Message must be at most ${MAX_MESSAGE_LENGTH} characters`),
});
