import { cn } from '@/lib/utils';

// Shared shell for public pages so every section has the same width, gutters and rhythm.
export const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
);

type SectionProps = {
  id?: string;
  className?: string;
  // Alternating muted bands make long pages easier to scan.
  muted?: boolean;
  children: React.ReactNode;
  'aria-labelledby'?: string;
};

export const Section = ({ id, className, muted, children, ...props }: SectionProps) => (
  <section
    id={id}
    className={cn('scroll-mt-20 py-16 sm:py-20', muted && 'border-y border-border/60 bg-muted/30', className)}
    {...props}
  >
    <Container>{children}</Container>
  </section>
);

type SectionHeadingProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  action?: React.ReactNode;
};

export const SectionHeading = ({ id, eyebrow, title, description, align = 'center', action }: SectionHeadingProps) => (
  <div
    className={cn(
      'mb-10 flex flex-col gap-4 sm:mb-12',
      align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
    )}
  >
    <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center')}>
      <span className='text-xs font-semibold tracking-widest text-primary uppercase'>{eyebrow}</span>
      <h2 id={id} className='max-w-2xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>
        {title}
      </h2>
      {description && <p className='max-w-2xl text-base text-pretty text-muted-foreground'>{description}</p>}
    </div>
    {action && <div className='shrink-0'>{action}</div>}
  </div>
);

// Page-level hero for secondary pages (About, Contact, Help, legal).
export const PageHero = ({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) => (
  <section className='relative isolate overflow-hidden border-b border-border/60'>
    <div aria-hidden className='absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-background to-background' />
    <div aria-hidden className='absolute -top-24 left-1/2 -z-10 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl' />
    <Container className='flex flex-col items-center gap-4 py-14 text-center sm:py-20'>
      <span className='rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
        {eyebrow}
      </span>
      <h1 className='max-w-3xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-5xl'>{title}</h1>
      <p className='max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg'>{description}</p>
    </Container>
  </section>
);

// Uniform feature/info card used across marketing pages.
export const InfoCard = ({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'group flex h-full flex-col gap-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/30',
      className,
    )}
  >
    <span className='flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground'>
      <Icon className='size-5' />
    </span>
    <h3 className='font-heading text-base font-semibold'>{title}</h3>
    <div className='text-sm leading-relaxed text-muted-foreground'>{children}</div>
  </div>
);
