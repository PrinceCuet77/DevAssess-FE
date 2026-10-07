import { getAssessment, getAssessmentList, getAssessmentReviews } from '@/api/assessment.api';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { CatalogQuery, CatalogReviewsQuery } from '@/types/assessment.types';

export const useGetAssessmentList = (query: CatalogQuery) => {
  return useQuery({
    queryKey: ['assessment-list', query],
    queryFn: () => getAssessmentList(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: false,
  });
};

export const useGetAssessment = (assessmentId: string) => {
  return useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => getAssessment(assessmentId),
    select: (response) => response.data,
    retry: false,
  });
};

// "Show more" pagination: each page appends to the list instead of replacing it.
export const useGetAssessmentReviews = (assessmentId: string, query: CatalogReviewsQuery) => {
  return useInfiniteQuery({
    queryKey: ['assessment-reviews', assessmentId, query],
    queryFn: ({ pageParam }) => getAssessmentReviews(assessmentId, { ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta && last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
    placeholderData: keepPreviousData,
    retry: false,
  });
};
