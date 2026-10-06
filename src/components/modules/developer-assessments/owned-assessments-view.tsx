'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import ClearFiltersButton from '@/components/shared/clear-filters-button';
import PaginationBar from '@/components/modules/admin-users/pagination-bar';
import OwnedAssessmentCard from '@/components/modules/developer-assessments/owned-assessment-card';
import OwnedAssessmentsEmptyState from '@/components/modules/developer-assessments/owned-assessments-empty-state';
import OwnedAssessmentsSkeleton from '@/components/modules/developer-assessments/owned-assessments-skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGetOwnedAssessments } from '@/hooks';
import { cn } from '@/lib/utils';
import type { OwnedAssessment, OwnedAssessmentsQuery, OwnedSortKey } from '@/types/developer-assessments.types';

const SELECT_CLASS =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[&>option]:bg-background';

const SORTS: { value: OwnedSortKey; label: string }[] = [
  { value: 'purchased:desc', label: 'Recently purchased' },
  { value: 'purchased:asc', label: 'Oldest purchased' },
  { value: 'title:asc', label: 'Title A-Z' },
  { value: 'duration:asc', label: 'Duration: short to long' },
  { value: 'duration:desc', label: 'Duration: long to short' },
];

const parseQuery = (params: URLSearchParams): OwnedAssessmentsQuery => {
  const num = (key: string) => {
    const n = Number(params.get(key));
    return Number.isInteger(n) && n > 0 ? n : undefined;
  };
  const sort = params.get('sort') as OwnedSortKey | null;
  return {
    search: params.get('search') || undefined,
    sort: SORTS.some((s) => s.value === sort) ? (sort as OwnedSortKey) : undefined,
    page: num('page') ?? 1,
    limit: Math.min(num('limit') ?? 9, 100),
  };
};

// The API can't list owned assessments, so search/sort/paging happen client-side over the flattened set.
const applyQuery = (items: OwnedAssessment[], { search, sort = 'purchased:desc' }: OwnedAssessmentsQuery) => {
  const term = search?.trim().toLowerCase();
  const filtered = term
    ? items.filter((a) =>
        [a.title, a.description, a.creator.name ?? '', a.creator.email].some((v) =>
          v.toLowerCase().includes(term),
        ),
      )
    : items;
  const [key, order] = sort.split(':');
  const dir = order === 'asc' ? 1 : -1;
  return [...filtered].sort((a, b) => {
    if (key === 'title') return a.title.localeCompare(b.title) * dir;
    if (key === 'duration') return (a.duration - b.duration) * dir;
    return a.purchasedAt.localeCompare(b.purchasedAt) * dir;
  });
};

const OwnedAssessmentsView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseQuery(searchParams);
  const { data, isPending, isError, refetch } = useGetOwnedAssessments();

  const [search, setSearch] = useState(query.search ?? '');
  const [prevSearch, setPrevSearch] = useState(query.search);

  const update = (patch: Partial<OwnedAssessmentsQuery>) => {
    const next = new URLSearchParams(window.location.search);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === '') next.delete(key);
      else next.set(key, String(value));
    });
    if (!('page' in patch)) next.delete('page');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Keep the input in sync when the URL changes elsewhere (e.g. "Clear filters").
  if (query.search !== prevSearch) {
    setPrevSearch(query.search);
    if ((query.search ?? '') !== search.trim()) setSearch(query.search ?? '');
  }

  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === (query.search ?? '')) return;
    const timer = setTimeout(() => update({ search: trimmed || undefined }), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- update only reads the live URL
  }, [search, query.search]);

  if (isPending) return <OwnedAssessmentsSkeleton />;

  if (isError) {
    return (
      <Card className='items-center gap-3 px-4 py-12 text-center'>
        <p className='text-sm text-muted-foreground'>
          We couldn&apos;t load your assessments. Please try again.
        </p>
        <Button variant='outline' onClick={() => refetch()}>
          Retry
        </Button>
      </Card>
    );
  }

  const results = applyQuery(data, query);
  const limit = query.limit ?? 9;
  const totalPages = Math.max(Math.ceil(results.length / limit), 1);
  const page = Math.min(query.page ?? 1, totalPages);
  const visible = results.slice((page - 1) * limit, page * limit);
  const filtered = Boolean(query.search || query.sort);
  const clearAll = () => update({ search: undefined, sort: undefined });

  if (data.length === 0) return <OwnedAssessmentsEmptyState filtered={false} onClear={clearAll} />;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
        <div className='relative sm:w-80'>
          <Search className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search by title, description or creator'
            aria-label='Search your assessments'
            className='pl-8'
          />
        </div>
        <select
          aria-label='Sort assessments'
          className={cn(SELECT_CLASS)}
          value={query.sort ?? 'purchased:desc'}
          onChange={(e) => update({ sort: e.target.value as OwnedSortKey })}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ClearFiltersButton active={filtered} onClear={clearAll} />
        <p className='text-sm text-muted-foreground sm:ml-auto' aria-live='polite'>
          {results.length} of {data.length} {data.length === 1 ? 'assessment' : 'assessments'}
        </p>
      </div>

      {visible.length === 0 ? (
        <OwnedAssessmentsEmptyState filtered onClear={clearAll} />
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {visible.map((assessment) => (
            <OwnedAssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </div>
      )}

      {results.length > 0 && (
        <Card className='py-0'>
          <PaginationBar
            meta={{ page, limit, total: results.length, totalPages }}
            noun={['assessment', 'assessments']}
            onPageChange={(p) => update({ page: p })}
            onLimitChange={(l) => update({ limit: l })}
          />
        </Card>
      )}
    </div>
  );
};

export default OwnedAssessmentsView;
