import Link from 'next/link';

const FOOTER_LINKS = [
  {
    heading: 'Product',
    links: [
      { label: 'Browse assessments', href: '/' },
      { label: 'For evaluators', href: '/' },
      { label: 'Pricing', href: '/' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About us', href: '/about-us' },
      { label: 'Contact', href: '/' },
      { label: 'Careers', href: '/' },
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

const Footer = () => {
  return (
    <footer className='border-t border-border/60 bg-background'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]'>
          <div className='max-w-xs space-y-4'>
            <Link href='/' className='font-heading text-lg font-semibold tracking-tight'>
              DevAssess
            </Link>
            <p className='text-sm text-muted-foreground'>
              A marketplace where evaluators publish paid technical assessments and developers prove
              their skills by taking them.
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.heading} className='space-y-3'>
              <p className='text-sm font-medium'>{group.heading}</p>
              <ul className='space-y-2'>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-10 flex flex-col-reverse items-center gap-4 border-t border-border/60 pt-6 sm:flex-row sm:justify-between'>
          <p className='text-xs text-muted-foreground'>
            © {new Date().getFullYear()} DevAssess. All rights reserved.
          </p>
          <div className='flex items-center gap-4 text-xs text-muted-foreground'>
            <Link href='/terms' className='hover:text-foreground'>
              Terms
            </Link>
            <Link href='/privacy' className='hover:text-foreground'>
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
