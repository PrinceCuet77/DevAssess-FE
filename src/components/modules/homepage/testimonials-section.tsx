'use client';

import Link from 'next/link';
import { Quote } from 'lucide-react';
import { Section, SectionHeading } from '@/components/layout/public/marketing-section';
import { Stars } from '@/components/modules/developer-assessments/assessment-reviews-panel';
import { getCatalogInsights, useHomeCatalog } from '@/components/modules/homepage/home-utils';
import { initials } from '@/components/modules/public-assessments/catalog-utils';
import { Skeleton } from '@/components/ui/skeleton';

// Real developer reviews pulled from the public catalog; no hand-written quotes.
const TestimonialsSection = () => {
  const { data, isPending, isError } = useHomeCatalog();
  const testimonials = data ? getCatalogInsights(data.data, 0).testimonials : [];
  if (isError || (!isPending && testimonials.length === 0)) return null;

  return (
    <Section muted aria-labelledby='testimonials-heading'>
      <SectionHeading
        id='testimonials-heading'
        eyebrow='Testimonials'
        title='What developers are saying'
        description='Straight from the reviews developers leave after taking an assessment.'
      />
      <ul className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        {isPending
          ? Array.from({ length: 3 }, (_, i) => (
              <li key={i}>
                <Skeleton className='h-56 rounded-xl' />
              </li>
            ))
          : testimonials.map((t) => (
              <li key={t.id}>
                <figure className='flex h-full flex-col gap-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10'>
                  <div className='flex items-center justify-between'>
                    <Stars rating={t.rating} className='size-4' />
                    <Quote className='size-6 text-primary/30' aria-hidden />
                  </div>
                  <blockquote className='line-clamp-5 flex-1 text-sm leading-relaxed text-foreground/90'>
                    “{t.comment}”
                  </blockquote>
                  <figcaption className='flex items-center gap-3 border-t border-border/60 pt-4'>
                    <span
                      aria-hidden
                      className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'
                    >
                      {initials(t.author)}
                    </span>
                    <span className='flex min-w-0 flex-col'>
                      <span className='truncate text-sm font-medium'>{t.author}</span>
                      <Link
                        href={`/assessments/detail?id=${t.assessment.id}`}
                        className='truncate text-xs text-muted-foreground hover:text-primary hover:underline'
                      >
                        on {t.assessment.title}
                      </Link>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
      </ul>
    </Section>
  );
};

export default TestimonialsSection;
