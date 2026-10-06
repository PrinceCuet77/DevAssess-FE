'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PaginationBar from '@/components/modules/admin-users/pagination-bar';
import ReviewCard from '@/components/modules/developer-reviews/review-card';
import ReviewsEmptyState from '@/components/modules/developer-reviews/reviews-empty-state';
import ReviewsFilters from '@/components/modules/developer-reviews/reviews-filters';
import ReviewsSkeleton from '@/components/modules/developer-reviews/reviews-skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetDeveloperReviewList } from '@/hooks';
import { cn } from '@/lib/utils';
import type { DeveloperReviewsQuery } from '@/types/developer-assessments.types';

const SORT_KEYS = ['createdAt', 'rating'] as const;

const parseQuery = (params: URLSearchParams): DeveloperReviewsQuery => {
  const num = (key: string) => {
    const n = Number(params.get(key));
    return Number.isInteger(n) && n > 0 ? n : undefined;
  };
  const sortOrder = params.get('sortOrder');
  return {
    search: params.get('search') || undefined,
    sortBy: SORT_KEYS.find((s) => s === params.get('sortBy')),
    sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
    page: num('page') ?? 1,
    limit: Math.min(num('limit') ?? 9, 100),
  };
};

const DeveloperReviewsView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseQuery(searchParams);
  const { data, isPending, isError, isFetching, refetch } = useGetDeveloperReviewList(query);

  // Filters live in the URL so lists are shareable and back-button friendly.
  const update = (patch: Partial<DeveloperReviewsQuery>) => {
    const next = new URLSearchParams(window.location.search);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === '') next.delete(key);
      else next.set(key, String(value));
    });
    if (!('page' in patch)) next.delete('page');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const clearAll = () => update({ search: undefined, sortBy: undefined, sortOrder: undefined });
  const reviews = data?.data ?? [];
  const filtered = Boolean(query.search);

  let content;
  if (isPending) {
    content = <ReviewsSkeleton />;
  } else if (isError) {
    content = (
      <Card className='items-center gap-3 px-4 py-12 text-center'>
        <p className='text-sm text-muted-foreground'>We couldn&apos;t load your reviews. Please try again.</p>
        <Button variant='outline' onClick={() => refetch()}>
          Retry
        </Button>
      </Card>
    );
  } else if (reviews.length === 0) {
    content = <ReviewsEmptyState filtered={filtered} onClear={clearAll} />;
  } else {
    content = (
      <>
        <div
          className={cn(
            'grid gap-4 sm:grid-cols-2 xl:grid-cols-3',
            isFetching && 'opacity-60 transition-opacity',
          )}
        >
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
        {data?.meta && (
          <Card className='py-0'>
            <PaginationBar
              meta={data.meta}
              noun={['review', 'reviews']}
              onPageChange={(page) => update({ page })}
              onLimitChange={(limit) => update({ limit })}
            />
          </Card>
        )}
      </>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <ReviewsFilters query={query} total={data?.meta?.total} onChange={update} />
      {content}
    </div>
  );
};

export default DeveloperReviewsView;
