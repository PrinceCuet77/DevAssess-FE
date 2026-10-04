import * as React from 'react';
import { cn } from 'cn';
import { Skeleton } from '@/components/ui/skeleton';

// Shared table primitives so every list in the app has the same look.

function DataTable({
  className,
  minWidth = 900,
  ...props
}: React.ComponentProps<'table'> & { minWidth?: number }) {
  return (
    <div className='overflow-x-auto'>
      <table
        data-slot='data-table'
        style={{ minWidth }}
        className={cn('w-full text-sm', className)}
        {...props}
      />
    </div>
  );
}

function DataTableHead({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      className={cn('border-b border-border/60 bg-muted/40', className)}
      {...props}
    />
  );
}

function DataTableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody className={cn('divide-y divide-border/60', className)} {...props} />;
}

function DataTableRow({
  className,
  muted,
  ...props
}: React.ComponentProps<'tr'> & { muted?: boolean }) {
  return (
    <tr
      className={cn('transition-colors hover:bg-muted/40', muted && 'opacity-60', className)}
      {...props}
    />
  );
}

function DataTableHeadCell({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-[11px] font-semibold tracking-wider whitespace-nowrap text-muted-foreground uppercase',
        className,
      )}
      {...props}
    />
  );
}

function DataTableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return <td className={cn('px-4 py-3.5 align-middle', className)} {...props} />;
}

// Two-line cell content: primary value with a muted caption underneath.
function CellStack({
  primary,
  secondary,
  className,
}: {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className='truncate font-medium tabular-nums'>{primary}</p>
      {secondary && (
        <p className='truncate text-xs text-muted-foreground tabular-nums'>{secondary}</p>
      )}
    </div>
  );
}

function DataTableSkeleton({ rows = 6, leadingRound }: { rows?: number; leadingRound?: boolean }) {
  return (
    <div className='flex flex-col divide-y divide-border/60'>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className='flex items-center gap-4 px-4 py-3.5'>
          <Skeleton className={cn('size-10', leadingRound ? 'rounded-full' : 'rounded-lg')} />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-40' />
            <Skeleton className='h-3 w-56' />
          </div>
          <Skeleton className='hidden h-5 w-20 sm:block' />
          <Skeleton className='hidden h-5 w-16 md:block' />
          <Skeleton className='hidden h-8 w-24 lg:block' />
        </div>
      ))}
    </div>
  );
}

export {
  CellStack,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow,
  DataTableSkeleton,
};
