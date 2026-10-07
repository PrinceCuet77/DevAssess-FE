'use client';

import { BookOpenCheck, Layers, MessageSquareText, Star, UserCheck } from 'lucide-react';
import { Container } from '@/components/layout/public/marketing-section';
import { getCatalogInsights, useHomeCatalog } from '@/components/modules/homepage/home-utils';
import { Skeleton } from '@/components/ui/skeleton';

const StatsSection = () => {
  const { data, isPending, isError } = useHomeCatalog();
  if (isError) return null;
  const insights = data ? getCatalogInsights(data.data, data.meta?.total ?? data.data.length) : null;

  const stats = insights
    ? [
        { icon: BookOpenCheck, value: insights.total.toLocaleString(), label: 'Published assessments' },
        { icon: UserCheck, value: insights.evaluators.toLocaleString(), label: 'Expert evaluators' },
        { icon: Layers, value: insights.topics.length.toLocaleString(), label: 'Topics covered' },
        { icon: MessageSquareText, value: insights.reviewCount.toLocaleString(), label: 'Developer reviews' },
        {
          icon: Star,
          value: insights.averageRating !== null ? `${insights.averageRating.toFixed(1)} / 5` : '-',
          label: 'Average rating',
        },
      ]
    : [];

  return (
    <section id='stats' aria-label='Marketplace in numbers' className='scroll-mt-16 border-b border-border/60 bg-muted/30'>
      <Container className='py-10'>
        <dl className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5'>
          {isPending
            ? Array.from({ length: 5 }, (_, i) => (
                <div key={i} className='flex flex-col items-center gap-2'>
                  <Skeleton className='h-8 w-20' />
                  <Skeleton className='h-3 w-28' />
                </div>
              ))
            : stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className='flex flex-col items-center gap-1 text-center last:col-span-2 sm:last:col-span-1'>
                  <dd className='flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl'>
                    <Icon className='size-5 text-primary' aria-hidden />
                    {value}
                  </dd>
                  <dt className='text-sm text-muted-foreground'>{label}</dt>
                </div>
              ))}
        </dl>
      </Container>
    </section>
  );
};

export default StatsSection;
