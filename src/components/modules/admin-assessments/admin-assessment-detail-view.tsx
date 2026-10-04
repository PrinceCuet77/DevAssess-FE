'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  FileText,
  Receipt,
  ShieldAlert,
  Star,
  Target,
  Trophy,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import AssessmentStatusBadge from '@/components/modules/admin-assessments/assessment-status-badge';
import UserAvatar from '@/components/modules/admin-users/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAdminAssessment, useGetAdminAssessmentRow } from '@/hooks';

const Stat = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) => (
  <Card size='sm'>
    <CardContent className='flex items-center justify-between gap-3'>
      <div>
        <p className='text-xs text-muted-foreground'>{label}</p>
        <p className='font-heading text-2xl font-semibold tabular-nums'>{value}</p>
      </div>
      <span className='flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
        <Icon className='size-4' />
      </span>
    </CardContent>
  </Card>
);

const Skeletons = () => (
  <div className='flex flex-col gap-6'>
    <Skeleton className='h-48 w-full' />
    <Skeleton className='h-24 w-full' />
    <Skeleton className='h-40 w-full' />
  </div>
);

const date = (value: string) => new Date(value).toLocaleDateString();

const AdminAssessmentDetailView = ({ assessmentId }: { assessmentId: string }) => {
  const { data: row, isPending: rowPending, error: rowError } = useGetAdminAssessmentRow(assessmentId);
  // Public detail only exists for PUBLISHED assessments; it adds the reviews. A 404 is expected otherwise.
  const { data: publicDetail, isPending: detailPending } = useGetAdminAssessment(assessmentId);

  const back = (
    <Link
      href='/admin/assessments'
      className='mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
    >
      <ArrowLeft className='size-4' /> Back to assessments
    </Link>
  );

  if (rowPending || detailPending) return <Skeletons />;

  if (!row && !publicDetail) {
    if (!rowError) notFound();
    return (
      <>
        {back}
        <Card>
          <CardContent className='py-6 text-center text-sm text-muted-foreground'>
            We couldn&apos;t load this assessment.
          </CardContent>
        </Card>
      </>
    );
  }

  const assessment = {
    ...(row ?? publicDetail!),
    reviews: publicDetail?.reviews ?? [],
    creator: row?.creator ?? publicDetail!.creator,
  };

  const reviews = assessment.reviews;
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;
  const deleted = row ? row.status === 'DELETED' || row.deletedAt !== null : false;
  const creatorSuspended = row?.creator.status === 'SUSPENDED';

  return (
    <>
      {back}
      <div className='flex flex-col gap-6'>
        {(deleted || creatorSuspended) && (
          <div
            role='status'
            className='flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm'
          >
            <ShieldAlert className='mt-0.5 size-4 shrink-0 text-destructive' />
            <p>
              {deleted
                ? 'This assessment has been deleted by its evaluator.'
                : "This assessment's evaluator is suspended."}
            </p>
          </div>
        )}

        <Card className='overflow-hidden pt-0'>
          <div className='h-32 overflow-hidden bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-sky-500/30'>
            {assessment.thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- remote URLs from the API, no configured image domains
              <img src={assessment.thumbnailUrl} alt={assessment.title} className='size-full object-cover' />
            )}
          </div>
          <CardContent className='flex flex-col gap-4 pt-4 sm:flex-row sm:items-start'>
            <div className='min-w-0 flex-1 space-y-3'>
              <div className='flex flex-wrap items-center gap-2'>
                <h2 className='font-heading text-xl font-semibold'>{assessment.title}</h2>
                {row ? (
                  <AssessmentStatusBadge status={row.status} />
                ) : (
                  <Badge variant='success'>Published</Badge>
                )}
              </div>
              <p className={assessment.description ? 'text-sm' : 'text-sm text-muted-foreground'}>
                {assessment.description ?? 'No description provided.'}
              </p>
              {assessment.tags.length > 0 && (
                <div className='flex flex-wrap gap-1.5'>
                  {assessment.tags.map((tag) => (
                    <Badge key={tag} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className='text-sm text-muted-foreground sm:text-right'>
              <p>Created {date(assessment.createdAt)}</p>
              {assessment.publishedAt && <p>Published {date(assessment.publishedAt)}</p>}
              {row?.deletedAt && <p>Deleted {date(row.deletedAt)}</p>}
            </div>
          </CardContent>
        </Card>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Stat label='Price (BDT)' value={Number(assessment.price).toFixed(2)} icon={Wallet} />
          <Stat label='Duration (min)' value={assessment.duration} icon={Clock} />
          <Stat label='Passing score' value={`${assessment.passingPercentage}%`} icon={Target} />
          <Stat label='Avg. rating' value={average === null ? 'N/A' : average.toFixed(1)} icon={Star} />
        </div>

        {row && (
          <div className='grid gap-4 sm:grid-cols-3'>
            <Stat label='Orders' value={row._count.purchases} icon={Receipt} />
            <Stat label='Attempts' value={row._count.attempts} icon={Trophy} />
            <Stat label='Reviews' value={row._count.reviews} icon={FileText} />
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Evaluator</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/admin/users/detail?id=${assessment.creator.id}`}
              className='flex items-center gap-3 hover:underline'
            >
              <UserAvatar name={assessment.creator.name} email={assessment.creator.email} avatarUrl={null} />
              <div className='min-w-0'>
                <p className='truncate font-medium'>{assessment.creator.name ?? assessment.creator.email}</p>
                {assessment.creator.name && (
                  <p className='truncate text-sm text-muted-foreground'>{assessment.creator.email}</p>
                )}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No reviews yet.</p>
            ) : (
              <ul className='divide-y divide-border/60'>
                {reviews.map((review) => (
                  <li key={review.id} className='flex flex-col gap-1 py-3 first:pt-0 last:pb-0'>
                    <div className='flex items-center justify-between gap-3'>
                      <Link
                        href={`/admin/users/detail?id=${review.developer.id}`}
                        className='truncate text-sm font-medium hover:underline'
                      >
                        {review.developer.name ?? review.developer.email}
                      </Link>
                      <span className='flex items-center gap-1 text-sm tabular-nums' aria-label={`${review.rating} out of 5`}>
                        <Star className='size-4 fill-amber-400 text-amber-400' /> {review.rating}
                      </span>
                    </div>
                    <p className={review.comment ? 'text-sm' : 'text-sm text-muted-foreground'}>
                      {review.comment ?? 'No comment.'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminAssessmentDetailView;
