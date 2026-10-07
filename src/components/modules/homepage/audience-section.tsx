import Link from 'next/link';
import { ArrowRight, Check, Code2, GraduationCap } from 'lucide-react';
import { Section, SectionHeading } from '@/components/layout/public/marketing-section';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AUDIENCES = [
  {
    icon: Code2,
    title: 'For developers',
    body: 'Benchmark yourself before an interview, validate a new stack, or find the gaps worth studying next.',
    points: [
      'Timed tests built by working engineers',
      'Automatic, objective grading against a clear pass mark',
      'Full attempt history and progress on your dashboard',
      'Rate and review every assessment you take',
    ],
    cta: { label: 'Browse assessments', href: '/assessments' },
  },
  {
    icon: GraduationCap,
    title: 'For evaluators',
    body: 'Turn your expertise into a product. Write an assessment once and earn every time a developer buys it.',
    points: [
      'Question builder with drafts, thumbnails and topics',
      'You set the price, duration and pass mark',
      'Sales, attempts and pass rate on your dashboard',
      'Direct feedback through developer reviews',
    ],
    cta: { label: 'Become an evaluator', href: '/register' },
  },
];

const AudienceSection = () => (
  <Section muted aria-labelledby='audience-heading'>
    <SectionHeading
      id='audience-heading'
      eyebrow='Who it’s for'
      title='Built for both sides of the table'
      description='Developers get a fair way to prove what they know. Evaluators get a storefront for their expertise.'
    />
    <div className='grid gap-6 lg:grid-cols-2'>
      {AUDIENCES.map((audience, i) => (
        <div key={audience.title} className='flex h-full flex-col gap-6 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8'>
          <div className='flex items-center gap-3'>
            <span className='flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20'>
              <audience.icon className='size-6' aria-hidden />
            </span>
            <h3 className='font-heading text-xl font-semibold tracking-tight'>{audience.title}</h3>
          </div>
          <p className='text-sm leading-relaxed text-muted-foreground sm:text-base'>{audience.body}</p>
          <ul className='flex flex-col gap-3'>
            {audience.points.map((point) => (
              <li key={point} className='flex items-start gap-2.5 text-sm'>
                <span className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary'>
                  <Check className='size-3' aria-hidden />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <Link
            href={audience.cta.href}
            className={cn(buttonVariants({ variant: i === 0 ? 'default' : 'outline', size: 'lg' }), 'mt-auto self-start px-4')}
          >
            {audience.cta.label}
            <ArrowRight />
          </Link>
        </div>
      ))}
    </div>
  </Section>
);

export default AudienceSection;
