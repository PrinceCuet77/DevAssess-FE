import { FileText } from 'lucide-react';
import Link from 'next/link';
import AssessmentStatusBadge from '@/components/modules/admin-assessments/assessment-status-badge';
import AssessmentRowActions from '@/components/modules/evaluator-assessments/assessment-row-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { EvaluatorAssessmentRow } from '@/types/evaluator-assessments.types';

const MAX_TAGS = 2;
const HEAD = 'px-4 py-2.5 text-left text-xs font-medium text-muted-foreground';

export const formatPrice = (price: string) =>
  Number(price) === 0 ? 'Free' : `৳${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const AssessmentsTableSkeleton = () => (
  <div className='flex flex-col divide-y divide-border/60'>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className='flex items-center gap-3 px-4 py-4'>
        <Skeleton className='size-12 rounded-lg' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-48' />
          <Skeleton className='h-3 w-32' />
        </div>
        <Skeleton className='h-5 w-16' />
      </div>
    ))}
  </div>
);

const Thumbnail = ({ src }: { src: string | null }) => (
  <div className='flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground'>
    {src ? (
      // eslint-disable-next-line @next/next/no-img-element -- remote URLs from the API, no configured image domains
      <img src={src} alt='' className='size-full object-cover' loading='lazy' />
    ) : (
      <FileText className='size-5' aria-hidden />
    )}
  </div>
);

const AssessmentsTable = ({ assessments }: { assessments: EvaluatorAssessmentRow[] }) => (
  <div className='overflow-x-auto'>
    <table className='w-full min-w-[860px] text-sm'>
      <thead className='border-b border-border/60 bg-muted/30'>
        <tr>
          <th className={HEAD}>Assessment</th>
          <th className={HEAD}>Status</th>
          <th className={HEAD}>Price</th>
          <th className={HEAD}>Duration</th>
          <th className={HEAD}>Pass mark</th>
          <th className={HEAD}>Created</th>
          <th className={cn(HEAD, 'w-12')}>
            <span className='sr-only'>Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className='divide-y divide-border/60'>
        {assessments.map((a) => {
          const deleted = a.status === 'DELETED';
          return (
            <tr key={a.id} className='hover:bg-muted/40'>
              <td className={cn('px-4 py-4', deleted && 'opacity-60')}>
                <div className='flex items-center gap-3'>
                  <Thumbnail src={a.thumbnailUrl} />
                  <div className='max-w-xs min-w-0'>
                    <Link
                      href={`/evaluator/assessments/detail?id=${a.id}`}
                      className={cn(
                        'block truncate font-medium hover:underline',
                        deleted && 'line-through',
                      )}
                    >
                      {a.title}
                    </Link>
                    {a.tags.length > 0 && (
                      <div className='mt-1 flex flex-wrap items-center gap-1'>
                        {a.tags.slice(0, MAX_TAGS).map((tag) => (
                          <span
                            key={tag}
                            className='rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground'
                          >
                            {tag}
                          </span>
                        ))}
                        {a.tags.length > MAX_TAGS && (
                          <span
                            className='text-xs text-muted-foreground'
                            title={a.tags.slice(MAX_TAGS).join(', ')}
                          >
                            +{a.tags.length - MAX_TAGS} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className='px-4 py-4'>
                <AssessmentStatusBadge status={a.status} />
              </td>
              <td className={cn('px-4 py-4 font-medium whitespace-nowrap tabular-nums', deleted && 'opacity-60')}>
                {formatPrice(a.price)}
              </td>
              <td className={cn('px-4 py-4 whitespace-nowrap tabular-nums', deleted && 'opacity-60')}>
                {a.duration} min
              </td>
              <td className={cn('px-4 py-4 whitespace-nowrap tabular-nums', deleted && 'opacity-60')}>
                {a.passingPercentage}%
              </td>
              <td className='px-4 py-4 whitespace-nowrap text-muted-foreground'>
                {new Date(a.createdAt).toLocaleDateString()}
              </td>
              <td className='px-4 py-4 text-right'>
                <AssessmentRowActions assessment={a} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default AssessmentsTable;
