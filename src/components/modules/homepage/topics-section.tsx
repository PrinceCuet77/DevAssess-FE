'use client';

import Link from 'next/link';
import { Hash } from 'lucide-react';
import { Section, SectionHeading } from '@/components/layout/public/marketing-section';
import { getCatalogInsights, useHomeCatalog } from '@/components/modules/homepage/home-utils';
import { Skeleton } from '@/components/ui/skeleton';

const MAX_TOPICS = 12;

const TopicsSection = () => {
  const { data, isPending, isError } = useHomeCatalog();
  const topics = data ? getCatalogInsights(data.data, 0).topics.slice(0, MAX_TOPICS) : [];
  if (isError || (!isPending && topics.length === 0)) return null;

  return (
    <Section muted aria-labelledby='topics-heading'>
      <SectionHeading
        id='topics-heading'
        eyebrow='Categories'
        title='Explore by topic'
        description='Jump straight to the stack you work with. Topics come from the assessments evaluators have published.'
      />
      <ul className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'>
        {isPending
          ? Array.from({ length: 8 }, (_, i) => (
              <li key={i}>
                <Skeleton className='h-[72px] rounded-xl' />
              </li>
            ))
          : topics.map(({ tag, count }) => (
              <li key={tag}>
                <Link
                  href={`/assessments?tags=${encodeURIComponent(tag)}`}
                  className='group flex h-[72px] items-center gap-3 rounded-xl bg-card px-4 ring-1 ring-foreground/10 transition-all outline-none hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50'
                >
                  <span className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground'>
                    <Hash className='size-4' aria-hidden />
                  </span>
                  <span className='flex min-w-0 flex-col'>
                    <span className='truncate text-sm font-semibold capitalize'>{tag}</span>
                    <span className='text-xs text-muted-foreground'>
                      {count} {count === 1 ? 'assessment' : 'assessments'}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
      </ul>
    </Section>
  );
};

export default TopicsSection;
