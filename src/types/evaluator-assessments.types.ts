import type { SortOrder } from '@/types/admin-users.types';
import type { AssessmentStatus } from '@/types/evaluator-dashboard.types';

export type EvaluatorAssessmentsSortBy = 'createdAt' | 'title' | 'price' | 'duration';

export type EvaluatorAssessmentsQuery = {
  status?: AssessmentStatus;
  search?: string;
  // Exact minutes, not a range.
  duration?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: EvaluatorAssessmentsSortBy;
  sortOrder?: SortOrder;
};

// Rows also carry the full `questions` / `answers`; the list only needs the summary fields.
export type EvaluatorAssessmentRow = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  tags: string[];
  // Minutes.
  duration: number;
  price: string;
  passingPercentage: number;
  status: AssessmentStatus;
  publishedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// Statuses that PATCH accepts - `DELETED` is only reachable through DELETE.
export type EvaluatorSettableStatus = Exclude<AssessmentStatus, 'DELETED'>;

export type EvaluatorQuestion = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  marks: number;
};

export type EvaluatorAnswerKey = { questionId: string; answer: string };

export type EvaluatorAssessmentReview = {
  id: string;
  rating: number;
  comment: string | null;
  developerId: string;
  assessmentId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EvaluatorAssessmentDetail = EvaluatorAssessmentRow & {
  questions: EvaluatorQuestion[];
  answers: EvaluatorAnswerKey[];
  creator: { id: string; name: string | null; email: string };
  reviews: EvaluatorAssessmentReview[];
};

export type CreateAssessmentPayload = {
  title: string;
  description?: string;
  // Integer minutes.
  duration: number;
  // JSON number, not a string; 0 = free.
  price: number;
  passingPercentage: number;
  thumbnailKey?: string;
  tags?: string[];
  questions: EvaluatorQuestion[];
  // Sent as `answer` (singular) but returned as `answers` on the assessment objects.
  answer: EvaluatorAnswerKey[];
};

// PATCH is a partial update. `questions` and `answer` must travel together (the API rejects one alone),
// and `thumbnailKey` can only replace the image - there is no way to remove it.
export type UpdateAssessmentPayload = Partial<Omit<CreateAssessmentPayload, 'questions' | 'answer'>> &
  (
    | { questions: CreateAssessmentPayload['questions']; answer: CreateAssessmentPayload['answer'] }
    | { questions?: never; answer?: never }
  ) & { status?: EvaluatorSettableStatus };

export type ThumbnailPresign = {
  uploadUrl: string;
  key: string;
  thumbnailUrl: string;
  expiresInSeconds: number;
};
