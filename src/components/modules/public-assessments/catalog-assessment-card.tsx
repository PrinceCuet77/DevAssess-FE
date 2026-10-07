import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock, Target } from 'lucide-react';
import { formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import { Stars } from '@/components/modules/developer-assessments/assessment-reviews-panel';
import AssessmentCover from '@/components/modules/public-assessments/assessment-cover';
import {
  averageRating,
  creatorName,
  formatDate,
  formatDuration,
} from '@/components/modules/public-assessments/catalog-utils';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CatalogAssessment } from '@/types/assessment.types';

const MAX_TAGS = 3;

type IProps = {
  assessment: CatalogAssessment;
  activeTags?: string[];
  // Without a handler (e.g. on the home page) tags link to the filtered catalog instead.
  onTagClick?: (tag: string) => void;
};

const TAG_CLASS =
  'rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground transition-colors outline-none hover:bg-primary/15 hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 disabled:bg-primary/15 disabled:text-primary';

const CatalogAssessmentCard = ({ assessment, activeTags = [], onTagClick }: IProps) => {
  const href = `/assessments/detail?id=${assessment.id}`;
  const average = averageRating(assessment.reviews);
  const extraTags = assessment.tags.length - MAX_TAGS;

  return (
    <article className='group relative flex w-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all duration-200 focus-within:ring-2 focus-within:ring-ring/60 hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/30'>
      <div className='relative'>
        <AssessmentCover
          id={assessment.id}
          title={assessment.title}
          tags={assessment.tags}
          src={assessment.thumbnailUrl}
          className='aspect-[16/9]'
        />
        <span className='absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold tabular-nums shadow-sm backdrop-blur'>
          {formatMoney(assessment.price)}
        </span>
      </div>

      <div className='flex flex-1 flex-col gap-3 p-4'>
        {assessment.tags.length > 0 && (
          // Tags sit above the stretched link so they stay independently clickable.
          <div className='relative z-10 flex flex-wrap gap-1.5'>
            {assessment.tags.slice(0, MAX_TAGS).map((tag) =>
              onTagClick ? (
                <button
                  key={tag}
                  type='button'
                  onClick={() => onTagClick(tag)}
                  disabled={activeTags.includes(tag)}
                  title={`Filter by ${tag}`}
                  className={TAG_CLASS}
                >
                  {tag}
                </button>
              ) : (
                <Link key={tag} href={`/assessments?tags=${encodeURIComponent(tag)}`} title={`Browse ${tag}`} className={TAG_CLASS}>
                  {tag}
                </Link>
              ),
            )}
            {extraTags > 0 && (
              <span className='px-1 py-0.5 text-[11px] text-muted-foreground'>+{extraTags}</span>
            )}
          </div>
        )}

        <div className='flex flex-col gap-1'>
          <h3 className='line-clamp-2 font-heading text-base leading-snug font-semibold tracking-tight'>
            <Link href={href} tabIndex={-1} className='outline-none after:absolute after:inset-0 after:content-[""]'>
              {assessment.title}
            </Link>
          </h3>
          <p className='truncate text-xs text-muted-foreground'>by {creatorName(assessment.creator)}</p>
        </div>

        <p className='line-clamp-2 text-sm text-muted-foreground'>{assessment.description}</p>

        <div className='mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground'>
          {average !== null ? (
            <span className='flex items-center gap-1.5'>
              <Stars rating={average} className='size-3.5' />
              <span className='font-medium text-foreground tabular-nums'>{average.toFixed(1)}</span>
              <span className='tabular-nums'>({assessment.reviews.length})</span>
            </span>
          ) : (
            <Badge variant='default'>New</Badge>
          )}
          <span className='flex items-center gap-3'>
            <span className='flex items-center gap-1' title='Time limit'>
              <Clock className='size-3.5' aria-hidden />
              {formatDuration(assessment.duration)}
            </span>
            <span className='flex items-center gap-1' title='Pass mark'>
              <Target className='size-3.5' aria-hidden />
              {assessment.passingPercentage}%
            </span>
          </span>
        </div>

        <div className='flex items-center justify-between gap-3'>
          <span className='flex items-center gap-1 text-xs text-muted-foreground'>
            <CalendarDays className='size-3.5' aria-hidden />
            {formatDate(assessment.publishedAt ?? assessment.createdAt)}
          </span>
          <Link
            href={href}
            aria-label={`View details: ${assessment.title}`}
            className={cn(buttonVariants({ size: 'sm' }), 'relative z-10')}
          >
            View details
            <ArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CatalogAssessmentCard;
