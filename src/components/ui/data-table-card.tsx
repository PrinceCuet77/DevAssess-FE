import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type IProps = {
  isPending: boolean;
  isError: boolean;
  isEmpty: boolean;
  isFetching?: boolean;
  errorMessage: string;
  skeleton: ReactNode;
  empty: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

// Card shell shared by every list page: loading, error, empty, table and pagination.
const DataTableCard = ({
  isPending,
  isError,
  isEmpty,
  isFetching,
  errorMessage,
  skeleton,
  empty,
  footer,
  children,
}: IProps) => (
  <Card className='gap-0 overflow-hidden py-0'>
    <CardContent className='p-0'>
      {isPending ? (
        skeleton
      ) : isError ? (
        <p className='py-10 text-center text-sm text-muted-foreground'>{errorMessage}</p>
      ) : isEmpty ? (
        empty
      ) : (
        <div className={isFetching ? 'opacity-60 transition-opacity' : undefined}>{children}</div>
      )}
      {footer}
    </CardContent>
  </Card>
);

export default DataTableCard;
