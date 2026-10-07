import Link from 'next/link';
import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => (
  <Link
    href='/'
    aria-label='DevAssess home'
    className={cn(
      'flex items-center gap-2 rounded-md font-heading text-lg font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
      className,
    )}
  >
    <span
      aria-hidden
      className='flex size-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground shadow-sm'
    >
      {'</>'}
    </span>
    {/* Hidden when the dashboard sidebar collapses to icons. */}
    <span className='group-data-[collapsible=icon]:hidden'>DevAssess</span>
  </Link>
);

export default Logo;
