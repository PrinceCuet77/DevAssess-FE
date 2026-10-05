'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ShoppingCart,
  FileText,
  ListChecks,
  ShieldAlert,
  Star,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FetchError } from 'ofetch';
import AssessmentStatusBadge from '@/components/modules/admin-assessments/assessment-status-badge';
import EvaluatorAssessmentActions from '@/components/modules/evaluator-assessments/evaluator-assessment-actions';
import { formatPrice } from '@/components/modules/evaluator-assessments/assessments-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PurchaseStatusBadge from '@/components/modules/admin-purchases/purchase-status-badge';
import {
  deriveOrderStatus,
  formatDateTime,
  formatMoney,
} from '@/components/modules/admin-purchases/purchase-utils';
import { orderAmountFor, salesByAssessment } from '@/components/modules/evaluator-assessments/purchase-stats';
import { useGetEvaluatorAssessment, useGetEvaluatorPurchases } from '@/hooks';
import { cn } from '@/lib/utils';
import type { EvaluatorAssessmentDetail, EvaluatorPurchaseRow } from '@/types/evaluator-assessments.types';

type Tab = 'overview' | 'questions' | 'reviews' | 'purchases';

const date = (value: string) => new Date(value).toLocaleDateString();

const Stat = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) => (
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
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className='h-20' />
      ))}
    </div>
    <Skeleton className='h-64 w-full' />
  </div>
);

const Stars = ({ rating }: { rating: number }) => (
  <span className='flex items-center gap-0.5' role='img' aria-label={`${rating} out of 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          'size-4',
          i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40',
        )}
      />
    ))}
  </span>
);

const Overview = ({ a, totalMarks }: { a: EvaluatorAssessmentDetail; totalMarks: number }) => {
  const passMarks = Math.ceil((totalMarks * a.passingPercentage) / 100);
  const rows: [string, string][] = [
    ['Price', formatPrice(a.price)],
    ['Duration', `${a.duration} min`],
    ['Questions', String(a.questions.length)],
    ['Total marks', String(totalMarks)],
    ['Passing score', `${a.passingPercentage}% (${passMarks} of ${totalMarks} marks)`],
    ['Created', date(a.createdAt)],
    ['Last updated', date(a.updatedAt)],
    ['Published', a.publishedAt ? date(a.publishedAt) : 'Not published'],
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className='grid gap-x-8 gap-y-4 sm:grid-cols-2 2xl:grid-cols-4'>
          {rows.map(([k, v]) => (
            <div key={k} className='flex items-center justify-between gap-4 border-b border-border/60 pb-3'>
              <dt className='text-sm text-muted-foreground'>{k}</dt>
              <dd className='text-sm font-medium tabular-nums'>{v}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};

const Questions = ({ a }: { a: EvaluatorAssessmentDetail }) => {
  const correct = new Map(a.answers.map((k) => [k.questionId, k.answer]));
  if (a.questions.length === 0)
    return (
      <Card>
        <CardContent className='py-6 text-center text-sm text-muted-foreground'>
          This assessment has no questions yet.
        </CardContent>
      </Card>
    );
  return (
    <div className='flex flex-col gap-4'>
      <p className='text-sm text-muted-foreground'>
        Only you can see the answer key. Correct options are highlighted.
      </p>
      {a.questions.map((q, index) => (
        <Card key={q.id}>
          <CardHeader>
            <div className='flex items-start justify-between gap-3'>
              <CardTitle className='leading-snug'>
                <span className='mr-2 text-muted-foreground tabular-nums'>{index + 1}.</span>
                {q.question}
              </CardTitle>
              <Badge variant='secondary' className='shrink-0'>
                {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className='flex flex-col gap-2'>
              {q.options.map((o) => {
                const isCorrect = correct.get(q.id) === o.id;
                return (
                  <li
                    key={o.id}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border px-3 py-2 text-sm',
                      isCorrect
                        ? 'border-emerald-500/40 bg-emerald-500/10 font-medium'
                        : 'border-border/60',
                    )}
                  >
                    <span className='w-5 shrink-0 text-xs font-semibold text-muted-foreground uppercase'>
                      {o.id}
                    </span>
                    <span className='min-w-0 flex-1'>{o.text}</span>
                    {isCorrect && (
                      <span className='flex shrink-0 items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400'>
                        <CheckCircle2 className='size-4' /> Correct
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const Reviews = ({ reviews }: { reviews: EvaluatorAssessmentDetail['reviews'] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Reviews ({reviews.length})</CardTitle>
    </CardHeader>
    <CardContent>
      {reviews.length === 0 ? (
        <p className='text-sm text-muted-foreground'>No reviews yet.</p>
      ) : (
        <ul className='divide-y divide-border/60'>
          {reviews.map((r) => (
            <li key={r.id} className='flex flex-col gap-1 py-3 first:pt-0 last:pb-0'>
              <div className='flex items-center justify-between gap-3'>
                <Stars rating={r.rating} />
                <span className='text-xs text-muted-foreground'>{date(r.createdAt)}</span>
              </div>
              <p className={r.comment ? 'text-sm' : 'text-sm text-muted-foreground'}>
                {r.comment ?? 'No comment.'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

const Purchases = ({
  assessmentId,
  orders,
  isPending,
  isError,
}: {
  assessmentId: string;
  orders: EvaluatorPurchaseRow[] | undefined;
  isPending: boolean;
  isError: boolean;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Purchases ({orders?.length ?? 0})</CardTitle>
    </CardHeader>
    <CardContent>
      {isPending ? (
        <Skeleton className='h-24 w-full' />
      ) : isError || !orders ? (
        <p className='text-sm text-muted-foreground'>We couldn&apos;t load the purchases.</p>
      ) : orders.length === 0 ? (
        <p className='text-sm text-muted-foreground'>No one has purchased this assessment yet.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[560px] text-sm'>
            <thead className='border-b border-border/60 text-xs text-muted-foreground'>
              <tr>
                <th className='py-2 pr-4 text-left font-medium'>Customer</th>
                <th className='px-4 py-2 text-left font-medium'>Date</th>
                <th className='px-4 py-2 text-left font-medium'>Status</th>
                <th className='py-2 pl-4 text-right font-medium'>Amount</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/60'>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className='py-3 pr-4'>
                    <p className='font-medium'>{o.customer.name ?? o.customer.email}</p>
                    {o.customer.name && <p className='text-xs text-muted-foreground'>{o.customer.email}</p>}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-muted-foreground'>{formatDateTime(o.createdAt)}</td>
                  <td className='px-4 py-3'>
                    <PurchaseStatusBadge status={deriveOrderStatus(o.payments)} />
                  </td>
                  <td className='py-3 pl-4 text-right font-medium whitespace-nowrap tabular-nums'>
                    {formatMoney(orderAmountFor(o, assessmentId))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CardContent>
  </Card>
);

const EvaluatorAssessmentDetailView = ({ assessmentId }: { assessmentId: string }) => {
  const { data: assessment, isPending, error } = useGetEvaluatorAssessment(assessmentId);
  const purchases = useGetEvaluatorPurchases(assessmentId);
  const sales = purchases.data && salesByAssessment(purchases.data).get(assessmentId);
  const [tab, setTab] = useState<Tab>('overview');

  const back = (
    <Link
      href='/evaluator/assessments'
      className='mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
    >
      <ArrowLeft className='size-4' /> Back to assessments
    </Link>
  );

  if (isPending && !error) return <Skeletons />;

  if (!assessment) {
    // 404 also covers "not yours"; 400 covers a malformed id.
    if (error instanceof FetchError && (error.status === 404 || error.status === 400)) notFound();
    return (
      <>
        {back}
        <Card>
          <CardContent className='py-6 text-center text-sm text-muted-foreground'>
            We couldn&apos;t load this assessment. Please try again.
          </CardContent>
        </Card>
      </>
    );
  }

  // The API returns soft-deleted reviews too.
  const reviews = assessment.reviews.filter((r) => r.deletedAt === null);
  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
  const totalMarks = assessment.questions.reduce((s, q) => s + q.marks, 0);
  const deleted = assessment.status === 'DELETED';

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'questions', label: `Questions (${assessment.questions.length})` },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    { id: 'purchases', label: `Purchases${purchases.data ? ` (${purchases.data.length})` : ''}` },
  ];

  return (
    <>
      {back}
      <div className='flex flex-col gap-6'>
        {deleted && (
          <div
            role='status'
            className='flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm'
          >
            <ShieldAlert className='mt-0.5 size-4 shrink-0 text-destructive' />
            <p>
              This assessment was deleted{assessment.deletedAt ? ` on ${date(assessment.deletedAt)}` : ''}.
              It is read-only and no longer available in the marketplace.
            </p>
          </div>
        )}

        <Card className='overflow-hidden pt-0'>
          <div className='h-36 overflow-hidden bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-sky-500/30'>
            {assessment.thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- remote URLs from the API, no configured image domains
              <img
                src={assessment.thumbnailUrl}
                alt={assessment.title}
                className={cn('size-full object-cover', deleted && 'grayscale')}
              />
            )}
          </div>
          <CardContent className='flex flex-col gap-4 pt-4 lg:flex-row lg:items-start lg:justify-between'>
            <div className='min-w-0 flex-1 space-y-3'>
              <div className='flex flex-wrap items-center gap-2'>
                <h2 className='font-heading text-xl font-semibold break-words'>{assessment.title}</h2>
                <AssessmentStatusBadge status={assessment.status} />
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
            <EvaluatorAssessmentActions assessment={assessment} />
          </CardContent>
        </Card>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Stat label='Price' value={formatPrice(assessment.price)} icon={Wallet} />
          <Stat label='Purchases' value={purchases.data ? (sales?.purchases ?? 0) : '—'} icon={ShoppingCart} />
          <Stat
            label='Revenue'
            value={purchases.data ? formatMoney(sales?.revenue ?? 0) : '—'}
            icon={Wallet}
          />
          <Stat label='Avg. rating' value={average === null ? 'N/A' : average.toFixed(1)} icon={Star} />
        </div>

        <div role='tablist' aria-label='Assessment sections' className='flex gap-1 border-b border-border/60'>
          {tabs.map((t) => (
            <button
              key={t.id}
              type='button'
              role='tab'
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                '-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {t.id === 'questions' ? <ListChecks className='size-4' /> : t.id === 'reviews' ? <Star className='size-4' /> : t.id === 'purchases' ? <ShoppingCart className='size-4' /> : <FileText className='size-4' />}
              {t.label}
            </button>
          ))}
        </div>

        <div role='tabpanel'>
          {tab === 'overview' && <Overview a={assessment} totalMarks={totalMarks} />}
          {tab === 'questions' && <Questions a={assessment} />}
          {tab === 'reviews' && <Reviews reviews={reviews} />}
          {tab === 'purchases' && (
            <Purchases
              assessmentId={assessmentId}
              orders={purchases.data}
              isPending={purchases.isPending}
              isError={purchases.isError}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EvaluatorAssessmentDetailView;
