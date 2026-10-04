import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AssessmentStatus } from '@/types/evaluator-dashboard.types';
import type { AdminRecentAssessment } from '@/types/admin-dashboard.types';

const STATUS_VARIANT: Record<AssessmentStatus, 'success' | 'warning' | 'secondary' | 'destructive'> = {
  PUBLISHED: 'success',
  DRAFT: 'warning',
  ARCHIVED: 'secondary',
  DELETED: 'destructive',
};

const RecentAssessments = ({ assessments }: { assessments: AdminRecentAssessment[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent assessments</CardTitle>
      <CardDescription>Latest assessments created by evaluators.</CardDescription>
    </CardHeader>
    <CardContent>
      {assessments.length === 0 ? (
        <p className='py-6 text-center text-sm text-muted-foreground'>No assessments yet.</p>
      ) : (
        <ul className='flex flex-col divide-y divide-border/60'>
          {assessments.map((assessment) => (
            <li key={assessment.id} className='flex items-center gap-3 py-3 first:pt-0 last:pb-0'>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{assessment.title}</p>
                <p className='truncate text-xs text-muted-foreground'>
                  {assessment.creator.name ?? assessment.creator.email} · BDT{' '}
                  {Number(assessment.price).toFixed(2)} ·{' '}
                  {new Date(assessment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[assessment.status]}>
                {assessment.status.charAt(0) + assessment.status.slice(1).toLowerCase()}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

export default RecentAssessments;
