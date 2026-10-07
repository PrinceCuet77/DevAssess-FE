import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpenCheck, CreditCard, GraduationCap, UserRound } from 'lucide-react';
import { InfoCard, PageHero, Section, SectionHeading } from '@/components/layout/public/marketing-section';
import FaqList from '@/components/shared/faq-list';
import { buttonVariants } from '@/components/ui/button';
import { FAQ_GROUPS } from '@/constants/faq';

export const metadata: Metadata = {
  title: 'Help center - DevAssess',
  description: 'Answers about buying, taking and publishing assessments on DevAssess.',
};

const GUIDES = [
  {
    icon: UserRound,
    title: 'Your account',
    body: 'Update your name, bio, skills and avatar from Profile, and change your password from the account menu.',
  },
  {
    icon: CreditCard,
    title: 'Orders and payments',
    body: 'Unpaid orders stay under Purchases so you can complete payment later. Every attempt is listed under Payments.',
  },
  {
    icon: BookOpenCheck,
    title: 'Taking assessments',
    body: 'Owned assessments live under My assessments. Open one to start, retake, view attempts or leave a review.',
  },
  {
    icon: GraduationCap,
    title: 'Publishing',
    body: 'Evaluators create assessments from New assessment, save drafts, then publish when the questions are ready.',
  },
];

const HelpPage = () => (
  <>
    <PageHero
      eyebrow='Help center'
      title='How can we help?'
      description='Guides and answers for developers and evaluators using DevAssess.'
    />
    <Section>
      <SectionHeading eyebrow='Guides' title='Find your way around' />
      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {GUIDES.map((guide) => (
          <InfoCard key={guide.title} icon={guide.icon} title={guide.title}>
            {guide.body}
          </InfoCard>
        ))}
      </div>
    </Section>
    <Section muted>
      <SectionHeading eyebrow='FAQ' title='Frequently asked questions' />
      <div className='mx-auto flex max-w-3xl flex-col gap-10'>
        {FAQ_GROUPS.map((group, i) => (
          <section key={group.title} aria-labelledby={`faq-group-${i}`} className='flex flex-col gap-4'>
            <h3 id={`faq-group-${i}`} className='font-heading text-lg font-semibold'>
              {group.title}
            </h3>
            <FaqList items={group.items} />
          </section>
        ))}
      </div>
    </Section>
    <Section>
      <div className='flex flex-col items-center gap-4 text-center'>
        <h2 className='font-heading text-2xl font-semibold tracking-tight'>Still need help?</h2>
        <p className='max-w-md text-sm text-muted-foreground'>
          Our support team answers every message within one business day.
        </p>
        <Link href='/contact' className={buttonVariants({ size: 'lg' })}>
          Contact support
        </Link>
      </div>
    </Section>
  </>
);

export default HelpPage;
