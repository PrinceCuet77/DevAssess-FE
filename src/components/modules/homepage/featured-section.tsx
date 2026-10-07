'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHeading } from '@/components/layout/public/marketing-section';
import { getCatalogInsights, useHomeCatalog } from '@/components/modules/homepage/home-utils';
import CatalogAssessmentCard from '@/components/modules/public-assessments/catalog-assessment-card';
import CatalogEmptyState from '@/components/modules/public-assessments/catalog-empty-state';
import { CatalogGridSkeleton } from '@/components/modules/public-assessments/catalog-skeleton';
import { Button, buttonVariants } from '@/components/ui/button';

const FeaturedSection = () => {
  const { data, isPending, isError, refetch } = useHomeCatalog();
  const featured = data ? getCatalogInsights(data.data, data.meta?.total ?? 0).featured : [];

  let content;
  if (isPending) content = <CatalogGridSkeleton count={6} />;
  else if (isError)
    content = (
      <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-16 text-center'>
        <p className='text-sm text-muted-foreground'>We couldn&apos;t load assessments. Please try again.</p>
        <Button variant='outline' onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  else if (featured.length === 0) content = <CatalogEmptyState filtered={false} onClear={() => {}} />;
  else
    content = (
      <ul className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        {featured.map((assessment) => (
          <li key={assessment.id} className='flex'>
            <CatalogAssessmentCard assessment={assessment} />
          </li>
        ))}
      </ul>
    );

  return (
    <Section aria-labelledby='featured-heading'>
      <SectionHeading
        id='featured-heading'
        eyebrow='Featured'
        title='Top-rated assessments'
        description='Hand-picked by developer ratings. Every one is timed, auto-graded and built by an experienced evaluator.'
        align='left'
        action={
          <Link href='/assessments' className={buttonVariants({ variant: 'outline' })}>
            View all assessments
            <ArrowRight />
          </Link>
        }
      />
      {content}
    </Section>
  );
};

export default FeaturedSection;
