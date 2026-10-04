import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AssessmentStatus, EvaluatorTopAssessment } from '@/types/evaluator-dashboard.types';

const STATUS_VARIANT: Record<AssessmentStatus, 'success' | 'warning' | 'secondary' | 'destructive'> = {
  PUBLISHED: 'success',
  DRAFT: 'warning',
  ARCHIVED: 'secondary',
  DELETED: 'destructive',
};

const TopAssessments = ({ assessments }: { assessments: EvaluatorTopAssessment[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Top assessments</CardTitle>
      <CardDescription>Ranked by number of purchases.</CardDescription>
    </CardHeader>
    <CardContent>
      {assessments.length === 0 ? (
        <p className='py-6 text-center text-sm text-muted-foreground'>No assessments yet.</p>
      ) : (
        <ul className='flex flex-col divide-y divide-border/60'>
          {assessments.map((assessment, index) => (
            <li key={assessment.id} className='flex items-center gap-3 py-3 first:pt-0 last:pb-0'>
              <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground'>
                {index + 1}
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{assessment.title}</p>
                <p className='text-xs text-muted-foreground'>
                  {assessment._count.purchases} sold · {assessment._count.attempts} attempts ·{' '}
                  {assessment._count.reviews} reviews · BDT {Number(assessment.price).toFixed(2)}
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

export default TopAssessments;
