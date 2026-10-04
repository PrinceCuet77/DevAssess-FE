import { FileText } from 'lucide-react';
import Link from 'next/link';
import AssessmentStatusBadge from '@/components/modules/admin-assessments/assessment-status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { AdminAssessmentRow } from '@/types/admin-assessments.types';

const MAX_TAGS = 2;
const HEAD = 'px-4 py-2.5 text-left text-xs font-medium text-muted-foreground';

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

const Thumbnail = ({ src, title }: { src: string | null; title: string }) => (
  <div className='flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground'>
    {src ? (
      // eslint-disable-next-line @next/next/no-img-element -- remote URLs from the API, no configured image domains
      <img src={src} alt={title} className='size-full object-cover' loading='lazy' />
    ) : (
      <FileText className='size-5' aria-hidden />
    )}
  </div>
);

type IProps = {
  assessments: AdminAssessmentRow[];
  onTagClick: (tag: string) => void;
};

const AssessmentsTable = ({ assessments, onTagClick }: IProps) => (
  <div className='overflow-x-auto'>
    <table className='w-full min-w-[920px] text-sm'>
      <thead className='border-b border-border/60 bg-muted/30'>
        <tr>
          <th className={HEAD}>Assessment</th>
          <th className={HEAD}>Evaluator</th>
          <th className={HEAD}>Price</th>
          <th className={HEAD}>Status</th>
          <th className={HEAD}>Sales &amp; activity</th>
          <th className={HEAD}>Created</th>
        </tr>
      </thead>
      <tbody className='divide-y divide-border/60'>
        {assessments.map((a) => {
          const deleted = a.status === 'DELETED' || a.deletedAt !== null;
          return (
            <tr key={a.id} className={cn('hover:bg-muted/40', deleted && 'opacity-60')}>
              <td className='px-4 py-4'>
                <div className='flex items-center gap-3'>
                  <Thumbnail src={a.thumbnailUrl} title={a.title} />
                  <div className='min-w-0 max-w-xs'>
                    <Link
                      href={`/admin/assessments/detail?id=${a.id}`}
                      className='block truncate font-medium hover:underline'
                    >
                      {a.title}
                    </Link>
                    {a.tags.length > 0 && (
                      <div className='mt-1 flex flex-wrap items-center gap-1'>
                        {a.tags.slice(0, MAX_TAGS).map((tag) => (
                          <button
                            key={tag}
                            type='button'
                            onClick={() => onTagClick(tag)}
                            aria-label={`Filter by tag ${tag}`}
                            className='rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50'
                          >
                            {tag}
                          </button>
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
                <Link
                  href={`/admin/users/detail?id=${a.creator.id}`}
                  className='block max-w-40 truncate font-medium hover:underline'
                >
                  {a.creator.name ?? a.creator.email}
                </Link>
                {a.creator.status === 'SUSPENDED' && (
                  <span className='text-xs text-destructive'>Suspended</span>
                )}
              </td>
              <td className='px-4 py-4 whitespace-nowrap'>
                <p className='font-medium tabular-nums'>BDT {Number(a.price).toFixed(2)}</p>
                <p className='text-xs text-muted-foreground'>
                  {a.duration} min · {a.passingPercentage}% to pass
                </p>
              </td>
              <td className='px-4 py-4'>
                <AssessmentStatusBadge status={a.status} />
              </td>
              <td className='px-4 py-4 whitespace-nowrap'>
                <p className='font-medium tabular-nums'>
                  {a._count.purchases} {a._count.purchases === 1 ? 'order' : 'orders'}
                </p>
                <p className='text-xs text-muted-foreground tabular-nums'>
                  {a._count.attempts} attempts · {a._count.reviews} reviews
                </p>
              </td>
              <td className='px-4 py-4 whitespace-nowrap text-muted-foreground'>
                {new Date(a.createdAt).toLocaleDateString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default AssessmentsTable;
