// Public catalog (`/assessments`): only PUBLISHED assessments, never questions or the answer key.

export type AssessmentPerson = { id: string; name: string | null; email: string };

export type CatalogReview = {
  id: string;
  rating: number;
  comment: string | null;
  developer: AssessmentPerson;
};

// Shared by `GET /assessments` and `GET /assessments/:id`.
export type CatalogAssessment = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  tags: string[];
  duration: number;
  price: string;
  passingPercentage: number;
  publishedAt: string | null;
  createdAt: string;
  creator: AssessmentPerson;
  reviews: CatalogReview[];
};

export type CatalogSortBy = 'title' | 'price' | 'createdAt' | 'duration';

export type CatalogQuery = {
  search?: string;
  // Sent comma-separated; the API lowercases and de-duplicates them.
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: CatalogSortBy;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

// `GET /assessments/:id/reviews` returns the full review row.
export type CatalogReviewRow = CatalogReview & {
  assessmentId: string;
  developerId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CatalogReviewsQuery = {
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
};
