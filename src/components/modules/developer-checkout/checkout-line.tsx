import Link from 'next/link';
import { Clock, Target, Trash2 } from 'lucide-react';
import { formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import AssessmentCover from '@/components/modules/public-assessments/assessment-cover';
import { formatDuration } from '@/components/modules/public-assessments/catalog-utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CartItem } from '@/types/cart.types';

type IProps = {
  item: Omit<CartItem, 'addedAt'>;
  notice?: React.ReactNode;
  muted?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
};

const CheckoutLine = ({ item, notice, muted, onRemove, disabled }: IProps) => (
  <li className='flex flex-col gap-3 py-4 first:pt-0 last:pb-0'>
    <div className={cn('flex gap-4', muted && 'opacity-60')}>
      <AssessmentCover
        id={item.id}
        title={item.title}
        tags={item.tags}
        src={item.thumbnailUrl}
        className='aspect-[16/10] w-24 shrink-0 rounded-lg sm:w-36'
      />
      <div className='flex min-w-0 flex-1 flex-col gap-1'>
        <Link href={`/assessments/detail?id=${item.id}`} className='font-heading text-sm font-semibold break-words hover:underline sm:text-base'>
          {item.title}
        </Link>
        <p className='text-xs text-muted-foreground'>by {item.creatorName}</p>
        <div className='mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1'>
            <Clock className='size-3.5' aria-hidden /> {formatDuration(item.duration)}
          </span>
          <span className='flex items-center gap-1'>
            <Target className='size-3.5' aria-hidden /> Pass {item.passingPercentage}%
          </span>
        </div>
      </div>
      <div className='flex shrink-0 flex-col items-end justify-between gap-2'>
        <span className='text-sm font-semibold tabular-nums'>{formatMoney(item.price)}</span>
        {onRemove && (
          <Button variant='ghost' size='icon-sm' aria-label={`Remove ${item.title}`} onClick={onRemove} disabled={disabled}>
            <Trash2 />
          </Button>
        )}
      </div>
    </div>
    {notice}
  </li>
);

export default CheckoutLine;
