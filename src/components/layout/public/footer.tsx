import Link from 'next/link';
import { Clock, Mail, MapPin } from 'lucide-react';
import Logo from '@/components/shared/logo';
import SocialIcon from '@/components/shared/social-icon';
import { SITE, SOCIAL_LINKS } from '@/constants/site';

const FOOTER_LINKS = [
  {
    heading: 'Marketplace',
    links: [
      { label: 'Browse assessments', href: '/assessments' },
      { label: 'Create an account', href: '/register' },
      { label: 'Log in', href: '/login' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About us', href: '/about-us' },
      { label: 'Contact', href: '/contact' },
      { label: 'Help center', href: '/help' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms of service', href: '/terms' },
      { label: 'Privacy policy', href: '/privacy' },
    ],
  },
] as const;

const linkClass =
  'rounded-sm text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50';

const Footer = () => {
  return (
    <footer className='border-t border-border/60 bg-muted/30'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.4fr]'>
          <div className='flex max-w-xs flex-col gap-4'>
            <Logo />
            <p className='text-sm text-muted-foreground'>
              A marketplace where evaluators publish paid technical assessments and developers prove
              their skills by taking them.
            </p>
            <ul className='flex items-center gap-2' aria-label='Social media'>
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`${SITE.name} on ${social.label}`}
                    className='flex size-9 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground transition-colors outline-none hover:border-primary/40 hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50'
                  >
                    <SocialIcon name={social.icon} className='size-4' />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_LINKS.map((group) => (
            <nav key={group.heading} aria-label={group.heading} className='flex flex-col gap-3'>
              <p className='text-sm font-semibold'>{group.heading}</p>
              <ul className='flex flex-col gap-2'>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className='flex flex-col gap-3'>
            <p className='text-sm font-semibold'>Get in touch</p>
            <address className='flex flex-col gap-2.5 text-sm text-muted-foreground not-italic'>
              <a href={`mailto:${SITE.email}`} className={`${linkClass} flex items-center gap-2`}>
                <Mail className='size-4 shrink-0' aria-hidden />
                {SITE.email}
              </a>
              <span className='flex items-center gap-2'>
                <MapPin className='size-4 shrink-0' aria-hidden />
                {SITE.address}
              </span>
              <span className='flex items-start gap-2'>
                <Clock className='mt-0.5 size-4 shrink-0' aria-hidden />
                {SITE.hours}
              </span>
            </address>
          </div>
        </div>

        <div className='mt-10 flex flex-col-reverse items-center gap-4 border-t border-border/60 pt-6 sm:flex-row sm:justify-between'>
          <p className='text-xs text-muted-foreground'>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className='flex items-center gap-4'>
            <Link href='/terms' className={`${linkClass} text-xs`}>
              Terms
            </Link>
            <Link href='/privacy' className={`${linkClass} text-xs`}>
              Privacy
            </Link>
            <Link href='/help' className={`${linkClass} text-xs`}>
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
