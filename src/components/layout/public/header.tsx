'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, LayoutDashboard, LifeBuoy, Menu, ScrollText, ShieldCheck, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/shared/logo';
import ThemeToggle from '@/components/shared/theme-toggle';
import UserNav from '@/components/shared/user-nav';
import { ROLE_DASHBOARD_PATH } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { useGetMyProfile } from '@/hooks';

const BASE_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/assessments', label: 'Assessments' },
  { href: '/about-us', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const RESOURCE_LINKS = [
  { href: '/help', label: 'Help center', description: 'Guides and answers to common questions', icon: LifeBuoy },
  { href: '/privacy', label: 'Privacy policy', description: 'How we handle your data', icon: ShieldCheck },
  { href: '/terms', label: 'Terms of service', description: 'The rules of the marketplace', icon: ScrollText },
] as const;

const isLinkActive = (pathname: string, href: string) =>
  href === '/' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

const linkClass = (active: boolean) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
  );

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user, isPending } = useGetMyProfile();

  // Signed-in users get a direct route into their role's dashboard.
  const links = user
    ? [...BASE_LINKS.slice(0, 2), { href: ROLE_DASHBOARD_PATH[user.role], label: 'Dashboard' }, ...BASE_LINKS.slice(2)]
    : BASE_LINKS;
  const resourcesActive = RESOURCE_LINKS.some((link) => isLinkActive(pathname, link.href));
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className='sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
        <Logo />

        <nav aria-label='Main' className='hidden items-center gap-1 lg:flex'>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(isLinkActive(pathname, link.href))}>
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(linkClass(resourcesActive), 'inline-flex items-center gap-1 data-popup-open:text-foreground')}>
              Resources
              <ChevronDown className='size-3.5 transition-transform in-data-popup-open:rotate-180' aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-72'>
              {RESOURCE_LINKS.map(({ href, label, description, icon: Icon }) => (
                <DropdownMenuItem key={href} render={<Link href={href} />} className='items-start gap-3 py-2'>
                  <span className='mt-0.5 flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                    <Icon className='size-4' />
                  </span>
                  <span className='flex flex-col'>
                    <span className='font-medium'>{label}</span>
                    <span className='text-xs text-muted-foreground'>{description}</span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className='hidden items-center gap-2 lg:flex'>
          <ThemeToggle />
          {isPending ? (
            <div className='size-8 animate-pulse rounded-full bg-muted' />
          ) : user ? (
            <UserNav />
          ) : (
            <>
              <Link href='/login' className={buttonVariants({ variant: 'ghost' })}>
                Log in
              </Link>
              <Link href='/register' className={buttonVariants()}>
                Get started
              </Link>
            </>
          )}
        </div>

        <div className='flex items-center gap-2 lg:hidden'>
          <ThemeToggle />
          {user && <UserNav />}
          <Button
            type='button'
            variant='ghost'
            size='icon'
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls='mobile-menu'
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? <X className='size-5' /> : <Menu className='size-5' />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div id='mobile-menu' className='max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-border/60 px-4 py-4 sm:px-6 lg:hidden'>
          <nav aria-label='Mobile' className='flex flex-col gap-1'>
            {links.map((link) => {
              const isActive = isLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {link.label === 'Dashboard' && <LayoutDashboard className='size-4' aria-hidden />}
                  {link.label}
                </Link>
              );
            })}
            <p className='mt-3 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase'>Resources</p>
            {RESOURCE_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isLinkActive(pathname, href) ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className='size-4' aria-hidden />
                {label}
              </Link>
            ))}
          </nav>

          {!user && !isPending && (
            <div className='mt-4 grid grid-cols-2 gap-2 border-t border-border/60 pt-4'>
              <Link href='/login' onClick={closeMenu} className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Log in
              </Link>
              <Link href='/register' onClick={closeMenu} className={buttonVariants({ size: 'lg' })}>
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
