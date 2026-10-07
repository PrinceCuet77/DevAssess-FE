'use client';

import CatalogAssessmentCard from '@/components/modules/public-assessments/catalog-assessment-card';
import { CatalogGridSkeleton } from '@/components/modules/public-assessments/catalog-skeleton';
import { useGetAssessmentList } from '@/hooks';
import type { CatalogAssessment } from '@/types/assessment.types';

const COUNT = 3;

// Same-topic assessments first (the API matches any tag); newest assessments fill the gaps.
const RelatedAssessments = ({ assessment }: { assessment: CatalogAssessment }) => {
  const byTag = useGetAssessmentList({ tags: assessment.tags.length ? assessment.tags : undefined, limit: COUNT + 1 });
  const latest = useGetAssessmentList({ limit: COUNT + 1 });

  const seen = new Set([assessment.id]);
  const related = [...(byTag.data?.data ?? []), ...(latest.data?.data ?? [])]
    .filter((a) => !seen.has(a.id) && seen.add(a.id))
    .slice(0, COUNT);

  if (!byTag.isPending && !latest.isPending && related.length === 0) return null;

  return (
    <section aria-labelledby='related-heading' className='flex flex-col gap-6'>
      <div>
        <h2 id='related-heading' className='font-heading text-xl font-semibold tracking-tight'>
          Related assessments
        </h2>
        <p className='text-sm text-muted-foreground'>More assessments on similar topics.</p>
      </div>
      {byTag.isPending ? (
        <CatalogGridSkeleton count={COUNT} />
      ) : (
        <ul className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {related.map((item) => (
            <li key={item.id} className='flex'>
              <CatalogAssessmentCard assessment={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RelatedAssessments;
