import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Sales - DevAssess',
};

const EvaluatorPurchasesPage = () => {
  return (
    <PlaceholderPage
      title='Sales'
      description='Purchases of your assessments.'
      api='GET /evaluator/purchases'
    />
  );
};

export default EvaluatorPurchasesPage;
