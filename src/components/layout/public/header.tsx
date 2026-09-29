'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import ThemeToggle from '@/components/shared/theme-toggle';
import UserNav from '@/components/shared/user-nav';
import { cn } from '@/lib/utils';
import { useGetMyProfile } from '@/hooks';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about-us', label: 'About' },
] as const;

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useGetMyProfile();

  return (
    <header className='sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <Link
          href='/'
          className='font-heading text-lg font-semibold tracking-tight'
        >
          DevAssess
        </Link>

        <nav className='hidden items-center gap-1 md:flex'>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className='hidden items-center gap-2 md:flex'>
          <ThemeToggle />
          <UserNav />
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <ThemeToggle />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? (
              <X className='size-5' />
            ) : (
              <Menu className='size-5' />
            )}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className='border-t border-border/60 px-4 py-4 sm:px-6 md:hidden'>
          <nav className='flex flex-col gap-1'>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className='mt-4 flex flex-col gap-2 border-t border-border/60 pt-4'>
            {user ? (
              <UserNav />
            ) : (
              <Link
                href='/login'
                onClick={() => setIsMenuOpen(false)}
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
