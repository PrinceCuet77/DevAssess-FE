import { averageRating } from '@/components/modules/public-assessments/catalog-utils';
import { useGetAssessmentList } from '@/hooks';
import type { CatalogAssessment } from '@/types/assessment.types';

// The API caps `limit` at 100, so the home page derives its numbers from the 100 newest published assessments.
export const HOME_QUERY = { limit: 100 } as const;

export const useHomeCatalog = () => useGetAssessmentList(HOME_QUERY);

export type Testimonial = {
  id: string;
  rating: number;
  comment: string;
  author: string;
  assessment: { id: string; title: string };
};

export const getCatalogInsights = (assessments: CatalogAssessment[], total: number) => {
  const reviews = assessments.flatMap((a) => a.reviews);
  const tagCounts = new Map<string, number>();
  for (const a of assessments) for (const t of a.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);

  // Rating weighted by volume so one 5-star review doesn't outrank a well-reviewed assessment.
  const score = (a: CatalogAssessment) => (averageRating(a.reviews) ?? 0) * Math.log2(a.reviews.length + 1);
  const featured = [...assessments].sort((a, b) => score(b) - score(a)).slice(0, 6);

  const testimonials: Testimonial[] = assessments
    .flatMap((a) =>
      a.reviews
        .filter((r) => r.comment && r.comment.trim().length >= 12 && r.developer.name)
        .map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment!.trim(),
          author: r.developer.name!,
          assessment: { id: a.id, title: a.title },
        })),
    )
    .sort((a, b) => b.rating - a.rating || b.comment.length - a.comment.length)
    .slice(0, 6);

  return {
    total,
    evaluators: new Set(assessments.map((a) => a.creator.id)).size,
    reviewCount: reviews.length,
    averageRating: averageRating(reviews),
    topics: [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count })),
    featured,
    testimonials,
  };
};

export type CatalogInsights = ReturnType<typeof getCatalogInsights>;
