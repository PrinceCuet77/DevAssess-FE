import { getEvaluatorDashboard } from '@/api/evaluator.api';
import { useQuery } from '@tanstack/react-query';

export const useGetEvaluatorDashboard = () => {
  return useQuery({
    queryKey: ['evaluator-dashboard'],
    queryFn: getEvaluatorDashboard,
    select: (response) => response.data,
    retry: false,
  });
};
