import { z } from 'zod';

export const MAX_TAGS = 20;
export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 6;
export const THUMBNAIL_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const THUMBNAIL_MAX_SIZE = 2 * 1024 * 1024;

const optionSchema = z.object({
  id: z.string(),
  text: z.string().trim().min(1, 'Option text is required').max(300, 'Option must be at most 300 characters'),
});

export const questionSchema = z
  .object({
    id: z.string(),
    question: z
      .string()
      .trim()
      .min(1, 'Question text is required')
      .max(1000, 'Question must be at most 1000 characters'),
    marks: z.number('Enter marks').positive('Marks must be greater than 0').max(1000, 'Marks must be at most 1000'),
    options: z
      .array(optionSchema)
      .min(MIN_OPTIONS, `Add at least ${MIN_OPTIONS} options`)
      .max(MAX_OPTIONS, `At most ${MAX_OPTIONS} options`),
    // Empty until the evaluator picks the radio; must point at one of the options.
    correctOptionId: z.string().min(1, 'Select the correct option'),
  })
  .refine((q) => q.options.some((o) => o.id === q.correctOptionId), {
    path: ['correctOptionId'],
    message: 'Select the correct option',
  })
  .refine((q) => new Set(q.options.map((o) => o.text.trim().toLowerCase())).size === q.options.length, {
    path: ['options'],
    message: 'Options must be different from each other',
  });

export const assessmentFormSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150, 'Title must be at most 150 characters'),
  description: z.string().trim().max(2000, 'Description must be at most 2000 characters'),
  tags: z.array(z.string().trim().min(1)).max(MAX_TAGS, `You can add up to ${MAX_TAGS} tags`),
  price: z.number('Enter a price').min(0, 'Price cannot be negative').max(1_000_000, 'Price is too high'),
  duration: z
    .number('Enter the duration')
    .int('Duration must be a whole number of minutes')
    .min(1, 'Duration must be at least 1 minute')
    .max(1440, 'Duration must be at most 1440 minutes'),
  passingPercentage: z
    .number('Enter a passing percentage')
    .int('Passing percentage must be a whole number')
    .min(1, 'Must be at least 1%')
    .max(100, 'Must be at most 100%'),
  thumbnailKey: z.string(),
  questions: z.array(questionSchema).min(1, 'Add at least one question'),
});

export type AssessmentFormValues = z.infer<typeof assessmentFormSchema>;
export type QuestionValues = z.infer<typeof questionSchema>;
