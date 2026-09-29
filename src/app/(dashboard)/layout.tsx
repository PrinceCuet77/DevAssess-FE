import Link from 'next/link';
import ThemeToggle from '@/components/shared/theme-toggle';
import UserNav from '@/components/shared/user-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-svh flex-col'>
      <header className='sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8'>
          <Link href='/' className='font-heading text-lg font-semibold tracking-tight'>
            DevAssess
          </Link>

          <div className='flex items-center gap-2'>
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      <main className='flex-1'>{children}</main>
    </div>
  );
}
