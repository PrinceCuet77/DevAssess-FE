'use client';

import { useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import CatalogAssessmentCard from '@/components/modules/public-assessments/catalog-assessment-card';
import CatalogEmptyState from '@/components/modules/public-assessments/catalog-empty-state';
import CatalogFilterPanel from '@/components/modules/public-assessments/catalog-filter-panel';
import CatalogPagination from '@/components/modules/public-assessments/catalog-pagination';
import CatalogSearch from '@/components/modules/public-assessments/catalog-search';
import { CatalogGridSkeleton } from '@/components/modules/public-assessments/catalog-skeleton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useGetAssessmentList } from '@/hooks';
import { cn } from '@/lib/utils';
import type { CatalogAssessment, CatalogQuery, CatalogSortBy } from '@/types/assessment.types';

const PAGE_SIZE = 12;
const SORT_KEYS: CatalogSortBy[] = ['title', 'price', 'createdAt', 'duration'];

const SORTS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'price:asc', label: 'Price: low to high' },
  { value: 'price:desc', label: 'Price: high to low' },
  { value: 'duration:asc', label: 'Shortest first' },
  { value: 'duration:desc', label: 'Longest first' },
  { value: 'title:asc', label: 'Title: A–Z' },
];

const SELECT_CLASS =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[&>option]:bg-background';

const parseQuery = (params: URLSearchParams): CatalogQuery => {
  const int = (key: string) => {
    const n = Number(params.get(key));
    return Number.isInteger(n) && n > 0 ? n : undefined;
  };
  const price = (key: string) => {
    const raw = params.get(key);
    const n = Number(raw);
    return raw && Number.isFinite(n) && n >= 0 ? n : undefined;
  };
  const tags = (params.get('tags') ?? '')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const sortOrder = params.get('sortOrder');
  return {
    search: params.get('search') || undefined,
    tags: tags.length ? [...new Set(tags)] : undefined,
    minPrice: price('minPrice'),
    maxPrice: price('maxPrice'),
    sortBy: SORT_KEYS.find((s) => s === params.get('sortBy')),
    sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
    page: int('page') ?? 1,
    limit: Math.min(int('limit') ?? PAGE_SIZE, 100),
  };
};

// The API has no "all tags" endpoint, so suggest the most common tags in the current results.
const topTags = (assessments: CatalogAssessment[], max = 10) => {
  const counts = new Map<string, number>();
  for (const a of assessments) for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, max)
    .map(([tag]) => tag);
};

const priceLabel = (min?: number, max?: number) => {
  if (min !== undefined && max !== undefined) return `${formatMoney(min)} – ${formatMoney(max)}`;
  if (min !== undefined) return `From ${formatMoney(min)}`;
  return `Up to ${formatMoney(max ?? 0)}`;
};

const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <button
    type='button'
    onClick={onRemove}
    aria-label={`Remove filter: ${label}`}
    className='inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50'
  >
    <span className='truncate'>{label}</span>
    <X className='size-3 shrink-0 text-muted-foreground' />
  </button>
);

const AssessmentCatalogView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);
  const query = parseQuery(searchParams);
  const { data, isPending, isError, isFetching, refetch } = useGetAssessmentList(query);

  // Filters live in the URL so searches are shareable and back-button friendly.
  const update = (patch: Partial<CatalogQuery>) => {
    const next = new URLSearchParams(window.location.search);
    Object.entries(patch).forEach(([key, value]) => {
      const serialized = Array.isArray(value) ? value.join(',') : value;
      if (serialized === undefined || serialized === '') next.delete(key);
      else next.set(key, String(serialized));
    });
    if (!('page' in patch)) next.delete('page');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const goToPage = (page: number) => {
    update({ page });
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const clearAll = () =>
    update({ search: undefined, tags: undefined, minPrice: undefined, maxPrice: undefined });

  const assessments = data?.data ?? [];
  const total = data?.meta?.total;
  const tags = query.tags ?? [];
  const hasPrice = query.minPrice !== undefined || query.maxPrice !== undefined;
  const filterCount = tags.length + (hasPrice ? 1 : 0);
  const filtered = Boolean(query.search) || filterCount > 0;
  const suggestedTags = topTags(assessments);
  const addTag = (tag: string) => !tags.includes(tag) && update({ tags: [...tags, tag] });

  const panel = <CatalogFilterPanel query={query} suggestedTags={suggestedTags} onChange={update} />;

  let content;
  if (isPending) {
    content = <CatalogGridSkeleton />;
  } else if (isError) {
    content = (
      <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-16 text-center'>
        <p className='text-sm text-muted-foreground'>We couldn&apos;t load assessments. Please try again.</p>
        <Button variant='outline' onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  } else if (assessments.length === 0) {
    content = <CatalogEmptyState filtered={filtered} onClear={clearAll} />;
  } else {
    content = (
      <>
        <ul
          className={cn(
            'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
            isFetching && 'opacity-60 transition-opacity',
          )}
          aria-busy={isFetching}
        >
          {assessments.map((assessment) => (
            <li key={assessment.id} className='flex'>
              <CatalogAssessmentCard
                assessment={assessment}
                activeTags={tags}
                onTagClick={addTag}
              />
            </li>
          ))}
        </ul>
        {data?.meta && <CatalogPagination meta={data.meta} onPageChange={goToPage} />}
      </>
    );
  }

  return (
    <div className='flex flex-col'>
      <section className='relative isolate overflow-hidden border-b border-border/60'>
        <div aria-hidden className='absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-background to-background' />
        <div aria-hidden className='absolute -top-24 left-1/2 -z-10 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl' />
        <div className='mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8'>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
            <Sparkles className='size-3.5' aria-hidden />
            Assessment marketplace
          </span>
          <h1 className='max-w-3xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-5xl'>
            Prove your skills with assessments built by experts
          </h1>
          <p className='max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg'>
            Timed, hands-on technical tests reviewed by experienced evaluators. Find the right
            challenge, take it at your own pace, and show what you know.
          </p>
          <CatalogSearch value={query.search} onChange={(search) => update({ search })} />
        </div>
      </section>

      <div className='mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 xl:grid-cols-[15rem_1fr] lg:px-8 lg:py-10'>
        <aside className='hidden xl:block' aria-label='Filters'>
          <div className='sticky top-24 flex flex-col gap-5'>
            <div className='flex items-center justify-between'>
              <h2 className='font-heading text-base font-semibold'>Filters</h2>
              {filterCount > 0 && (
                <Button
                  variant='link'
                  size='sm'
                  className='h-auto px-0'
                  onClick={() => update({ tags: undefined, minPrice: undefined, maxPrice: undefined })}
                >
                  Reset
                </Button>
              )}
            </div>
            {panel}
          </div>
        </aside>

        <div ref={resultsRef} className='flex min-w-0 scroll-mt-24 flex-col gap-5'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <p className='text-sm text-muted-foreground' aria-live='polite'>
              {total === undefined ? (
                isPending && 'Loading assessments…'
              ) : (
                <>
                  <span className='font-semibold text-foreground tabular-nums'>{total}</span>{' '}
                  {total === 1 ? 'assessment' : 'assessments'}
                  {query.search && (
                    <>
                      {' '}
                      for <span className='font-medium text-foreground'>“{query.search}”</span>
                    </>
                  )}
                </>
              )}
            </p>
            <div className='flex items-center gap-2'>
              <Sheet>
                <SheetTrigger render={<Button variant='outline' className='xl:hidden' />}>
                  <SlidersHorizontal />
                  Filters
                  {filterCount > 0 && (
                    <span className='ml-0.5 rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground tabular-nums'>
                      {filterCount}
                    </span>
                  )}
                </SheetTrigger>
                <SheetContent side='left' className='overflow-y-auto'>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className='px-4 pb-6'>{panel}</div>
                </SheetContent>
              </Sheet>
              <select
                aria-label='Sort assessments'
                className={SELECT_CLASS}
                value={`${query.sortBy ?? 'createdAt'}:${query.sortOrder ?? 'desc'}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split(':');
                  // The default (newest first) stays out of the URL to keep links clean.
                  const isDefault = e.target.value === 'createdAt:desc';
                  update({
                    sortBy: isDefault ? undefined : (sortBy as CatalogSortBy),
                    sortOrder: isDefault ? undefined : (sortOrder as CatalogQuery['sortOrder']),
                  });
                }}
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered && (
            <div className='flex flex-wrap items-center gap-2'>
              {query.search && <Chip label={`“${query.search}”`} onRemove={() => update({ search: undefined })} />}
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  onRemove={() => update({ tags: tags.filter((t) => t !== tag) })}
                />
              ))}
              {hasPrice && (
                <Chip
                  label={priceLabel(query.minPrice, query.maxPrice)}
                  onRemove={() => update({ minPrice: undefined, maxPrice: undefined })}
                />
              )}
              <Button variant='ghost' size='sm' onClick={clearAll}>
                Clear all
              </Button>
            </div>
          )}

          {content}
        </div>
      </div>
    </div>
  );
};

export default AssessmentCatalogView;
