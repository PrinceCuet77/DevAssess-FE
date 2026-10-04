import { Badge } from '@/components/ui/badge';
import { label } from '@/components/modules/admin-users/user-badges';
import type { AssessmentStatus } from '@/types/evaluator-dashboard.types';

const STATUS_VARIANT: Record<
  AssessmentStatus,
  'success' | 'warning' | 'secondary' | 'destructive'
> = {
  PUBLISHED: 'success',
  DRAFT: 'warning',
  ARCHIVED: 'secondary',
  DELETED: 'destructive',
};

const AssessmentStatusBadge = ({ status }: { status: AssessmentStatus }) => (
  <Badge variant={STATUS_VARIANT[status]}>{label(status)}</Badge>
);

export default AssessmentStatusBadge;
