import { cn } from '@/lib/utils';

const SIZES = {
  // Data-heavy pages (dashboards, tables, details) use the full content width;
  // the cap only kicks in on ultra-wide screens so lines stay scannable.
  full: 'max-w-[1920px]',
  // Single forms read badly when stretched edge to edge.
  form: 'max-w-2xl',
} as const;

type PageContainerProps = {
  size?: keyof typeof SIZES;
  className?: string;
  children: React.ReactNode;
};

const PageContainer = ({ size = 'full', className, children }: PageContainerProps) => (
  <div
    className={cn(
      'mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8',
      SIZES[size],
      className,
    )}
  >
    {children}
  </div>
);

export default PageContainer;
