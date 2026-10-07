import { CreditCard, PlayCircle, Search, Trophy } from 'lucide-react';
import { Section, SectionHeading } from '@/components/layout/public/marketing-section';

const STEPS = [
  {
    icon: Search,
    title: 'Find your assessment',
    body: 'Search the catalog, filter by topic and price, and read reviews from developers who took it.',
  },
  {
    icon: CreditCard,
    title: 'Buy it once',
    body: 'Pay securely through SSLCommerz. The assessment lands in your dashboard the moment payment succeeds.',
  },
  {
    icon: PlayCircle,
    title: 'Take it on your schedule',
    body: 'Start when you are ready. The timer starts the moment you begin, so pick a quiet moment.',
  },
  {
    icon: Trophy,
    title: 'Get your result',
    body: 'Answers are graded automatically against the pass mark. Retake as often as you like to improve.',
  },
];

const HowItWorksSection = () => (
  <Section aria-labelledby='how-heading'>
    <SectionHeading
      id='how-heading'
      eyebrow='How it works'
      title='From search to scorecard in four steps'
      description='No subscriptions and no sessions to book. Everything happens from your dashboard.'
    />
    <ol className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
      {STEPS.map((step, i) => (
        <li key={step.title} className='relative flex h-full flex-col gap-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10'>
          <div className='flex items-center justify-between'>
            <span className='flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20'>
              <step.icon className='size-5' aria-hidden />
            </span>
            <span className='font-mono text-sm font-semibold text-muted-foreground/70' aria-hidden>
              0{i + 1}
            </span>
          </div>
          <h3 className='font-heading text-base font-semibold'>{step.title}</h3>
          <p className='text-sm leading-relaxed text-muted-foreground'>{step.body}</p>
        </li>
      ))}
    </ol>
  </Section>
);

export default HowItWorksSection;
