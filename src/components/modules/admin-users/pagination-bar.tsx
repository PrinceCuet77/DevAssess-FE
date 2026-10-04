import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ApiResponseMeta } from '@/types/api.types';

const PAGE_SIZES = [10, 20, 50, 100];

type IProps = {
  meta: ApiResponseMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const PaginationBar = ({ meta, onPageChange, onLimitChange }: IProps) => (
  <div className='flex flex-col items-center justify-between gap-3 border-t border-border/60 px-4 py-3 text-sm sm:flex-row'>
    <p className='text-muted-foreground'>
      {meta.total} {meta.total === 1 ? 'user' : 'users'} · Page {meta.page} of{' '}
      {Math.max(meta.totalPages, 1)}
    </p>
    <div className='flex items-center gap-2'>
      <select
        aria-label='Rows per page'
        className='h-8 rounded-lg border border-input bg-transparent px-2 text-sm dark:bg-input/30 dark:[&>option]:bg-background'
        value={meta.limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size} / page
          </option>
        ))}
      </select>
      <Button
        variant='outline'
        size='icon'
        aria-label='Previous page'
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        <ChevronLeft />
      </Button>
      <Button
        variant='outline'
        size='icon'
        aria-label='Next page'
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPageChange(meta.page + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  </div>
);

export default PaginationBar;
