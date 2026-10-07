import { Suspense } from 'react';
import type { Metadata } from 'next';
import AssessmentCatalogView from '@/components/modules/public-assessments/assessment-catalog-view';
import CatalogSkeleton from '@/components/modules/public-assessments/catalog-skeleton';

export const metadata: Metadata = {
  title: 'Browse assessments | DevAssess',
  description: 'Find timed technical assessments built by expert evaluators and prove your skills.',
};

const AssessmentsPage = () => (
  <Suspense fallback={<CatalogSkeleton />}>
    <AssessmentCatalogView />
  </Suspense>
);

export default AssessmentsPage;
