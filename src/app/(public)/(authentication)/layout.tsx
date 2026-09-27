import Link from 'next/link';
import ThemeToggle from '@/components/shared/theme-toggle';
import AuthNav from '@/components/modules/auth/auth-nav';

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-svh flex-col'>
      <header className='flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
        <Link href='/' className='font-heading text-lg font-semibold tracking-tight'>
          DevAssess
        </Link>
        <div className='flex items-center gap-2'>
          <AuthNav />
          <ThemeToggle />
        </div>
      </header>

      <main className='grid flex-1 lg:grid-cols-2'>{children}</main>
    </div>
  );
}
