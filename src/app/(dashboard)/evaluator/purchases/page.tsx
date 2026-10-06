import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import EvaluatorPurchasesView from '@/components/modules/evaluator-purchases/evaluator-purchases-view';
import { DataTableSkeleton } from '@/components/ui/data-table';

export const metadata: Metadata = {
  title: 'Sales - DevAssess',
};

const EvaluatorPurchasesPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title='Sales'
        description='Orders that include your assessments, what you earned, and how they were paid.'
      />
      <Suspense fallback={<DataTableSkeleton leadingRound />}>
        <EvaluatorPurchasesView />
      </Suspense>
    </PageContainer>
  );
};

export default EvaluatorPurchasesPage;
