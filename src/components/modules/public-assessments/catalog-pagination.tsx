import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ApiResponseMeta } from '@/types/api.types';

// 1 … 4 5 [6] 7 8 … 20 - always keeps first/last and two neighbours of the current page.
const pageItems = (page: number, totalPages: number): (number | 'gap')[] => {
  const pages = new Set([1, totalPages, page - 2, page - 1, page, page + 1, page + 2]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['gap' as const, p] : [p]));
};

type IProps = {
  meta: ApiResponseMeta;
  onPageChange: (page: number) => void;
};

const CatalogPagination = ({ meta, onPageChange }: IProps) => {
  if (meta.totalPages <= 1) return null;
  const from = (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);

  return (
    <nav aria-label='Pagination' className='flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row'>
      <p className='text-sm text-muted-foreground tabular-nums'>
        Showing {from}–{to} of {meta.total}
      </p>
      <div className='flex items-center gap-1'>
        <Button
          variant='ghost'
          size='sm'
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft /> Prev
        </Button>
        <div className='hidden items-center gap-1 sm:flex'>
          {pageItems(meta.page, meta.totalPages).map((item, i) =>
            item === 'gap' ? (
              <span key={`gap-${i}`} className='px-1 text-muted-foreground' aria-hidden>
                …
              </span>
            ) : (
              <Button
                key={item}
                variant={item === meta.page ? 'default' : 'ghost'}
                size='icon-sm'
                aria-label={`Page ${item}`}
                aria-current={item === meta.page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
                className='tabular-nums'
              >
                {item}
              </Button>
            ),
          )}
        </div>
        <span className='px-2 text-sm text-muted-foreground tabular-nums sm:hidden'>
          {meta.page} / {meta.totalPages}
        </span>
        <Button
          variant='ghost'
          size='sm'
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next <ChevronRight />
        </Button>
      </div>
    </nav>
  );
};

export default CatalogPagination;
