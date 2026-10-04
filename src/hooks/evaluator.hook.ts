import {
  deleteEvaluatorAssessment,
  getEvaluatorAssessments,
  getEvaluatorDashboard,
  updateEvaluatorAssessmentStatus,
} from '@/api/evaluator.api';
import type { EvaluatorAssessmentsQuery } from '@/types/evaluator-assessments.types';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetEvaluatorDashboard = () => {
  return useQuery({
    queryKey: ['evaluator-dashboard'],
    queryFn: getEvaluatorDashboard,
    select: (response) => response.data,
    retry: false,
  });
};

export const useGetEvaluatorAssessments = (query: EvaluatorAssessmentsQuery) => {
  return useQuery({
    queryKey: ['evaluator-assessments', query],
    queryFn: () => getEvaluatorAssessments(query),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

// Status changes ripple into the list and the dashboard's status breakdown / top assessments.
const useInvalidateEvaluatorAssessments = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['evaluator-assessments'] });
    queryClient.invalidateQueries({ queryKey: ['evaluator-dashboard'] });
  };
};

export const useUpdateEvaluatorAssessmentStatus = () => {
  const invalidate = useInvalidateEvaluatorAssessments();
  return useMutation({ mutationFn: updateEvaluatorAssessmentStatus, onSuccess: invalidate });
};

export const useDeleteEvaluatorAssessment = () => {
  const invalidate = useInvalidateEvaluatorAssessments();
  return useMutation({ mutationFn: deleteEvaluatorAssessment, onSuccess: invalidate });
};
