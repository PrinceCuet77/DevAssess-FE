import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api.types';
import type {
  CreateAssessmentPayload,
  EvaluatorAssessmentDetail,
  EvaluatorAssessmentRow,
  EvaluatorAssessmentsQuery,
  EvaluatorPurchaseRow,
  EvaluatorSettableStatus,
  ThumbnailPresign,
  UpdateAssessmentPayload,
} from '@/types/evaluator-assessments.types';
import type { EvaluatorDashboardData } from '@/types/evaluator-dashboard.types';

export const getEvaluatorDashboard = () => {
  return apiClient<ApiResponse<EvaluatorDashboardData>>('/evaluator/dashboard');
};

// The API rejects empty strings (e.g. `search=`), so drop empty params up front.
const compact = (query: EvaluatorAssessmentsQuery) =>
  Object.fromEntries(
    Object.entries(query).filter(([, v]) => v !== undefined && v !== ''),
  );

export const getEvaluatorAssessments = (query: EvaluatorAssessmentsQuery) => {
  return apiClient<ApiResponse<EvaluatorAssessmentRow[]>>(
    '/evaluator/assessments',
    {
      query: compact(query),
    },
  );
};

export const getEvaluatorAssessment = (assessmentId: string) => {
  return apiClient<ApiResponse<EvaluatorAssessmentDetail>>(
    `/evaluator/assessments/${assessmentId}`,
  );
};

export const updateEvaluatorAssessment = ({
  assessmentId,
  payload,
}: {
  assessmentId: string;
  payload: UpdateAssessmentPayload;
}) => {
  return apiClient<ApiResponse<EvaluatorAssessmentRow>>(
    `/evaluator/assessments/${assessmentId}`,
    {
      method: 'PATCH',
      body: payload,
    },
  );
};

export const updateEvaluatorAssessmentStatus = ({
  assessmentId,
  status,
}: {
  assessmentId: string;
  status: EvaluatorSettableStatus;
}) => updateEvaluatorAssessment({ assessmentId, payload: { status } });

export const deleteEvaluatorAssessment = (assessmentId: string) => {
  return apiClient<ApiResponse<null>>(
    `/evaluator/assessments/${assessmentId}`,
    {
      method: 'DELETE',
    },
  );
};

export const createEvaluatorAssessment = (payload: CreateAssessmentPayload) => {
  return apiClient<ApiResponse<EvaluatorAssessmentRow>>(
    '/evaluator/assessment',
    {
      method: 'POST',
      body: payload,
    },
  );
};

export const getThumbnailPresign = (payload: {
  fileName: string;
  fileType: string;
}) => {
  return apiClient<ApiResponse<ThumbnailPresign>>(
    '/evaluator/assessment/thumbnail/presign',
    {
      method: 'POST',
      body: payload,
    },
  );
};

// Goes straight to S3: no cookies, no auth header, and Content-Type must match the presigned fileType.
const uploadThumbnailToS3 = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!response.ok) throw new Error('Thumbnail upload failed');
};

export const uploadAssessmentThumbnail = async (file: File) => {
  const { data } = await getThumbnailPresign({
    fileName: file.name,
    fileType: file.type,
  });
  await uploadThumbnailToS3(data.uploadUrl, file);
  return data;
};

const PURCHASES_PAGE_SIZE = 100;

// Assessment endpoints carry no sales data, so pull the evaluator's orders (optionally for one assessment), all pages.
export const getEvaluatorPurchases = async (assessmentId?: string) => {
  const rows: EvaluatorPurchaseRow[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const res = await apiClient<ApiResponse<EvaluatorPurchaseRow[]>>(
      '/evaluator/purchases',
      {
        query: {
          page,
          limit: PURCHASES_PAGE_SIZE,
          ...(assessmentId && { assessmentId }),
        },
      },
    );
    rows.push(...res.data);
    totalPages = res.meta?.totalPages ?? 1;
    page += 1;
  } while (page <= totalPages);
  return rows;
};
