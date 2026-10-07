import Link from 'next/link';
import { ArrowRight, Code2, GraduationCap, Handshake, Scale, ShieldCheck, Sparkles, UserCog } from 'lucide-react';
import { InfoCard, PageHero, Section, SectionHeading } from '@/components/layout/public/marketing-section';
import StatsSection from '@/components/modules/homepage/stats-section';
import { buttonVariants } from '@/components/ui/button';

const VALUES = [
  { icon: Scale, title: 'Fair by design', body: 'Fixed time limits, a published pass mark and automatic grading mean every developer is measured the same way.' },
  { icon: ShieldCheck, title: 'Trust first', body: 'Answer keys never leave the server, payments go through a licensed gateway, and reviews come from real buyers.' },
  { icon: Handshake, title: 'Good for both sides', body: 'Developers pay once for a meaningful test; evaluators earn from expertise they would otherwise give away.' },
  { icon: Sparkles, title: 'Simple to use', body: 'Clean dashboards for every role, responsive on every screen, in light or dark mode.' },
];

const ROLES = [
  { icon: Code2, title: 'Developers', body: 'Browse the catalog, buy assessments, take timed attempts, track scores and review what they took.' },
  { icon: GraduationCap, title: 'Evaluators', body: 'Write and price assessments, publish or archive them, and follow sales, attempts and reviews.' },
  { icon: UserCog, title: 'Admins', body: 'Oversee users, assessments and orders, verify or suspend accounts, and watch platform analytics.' },
];

const AboutView = () => (
  <>
    <PageHero
      eyebrow='About DevAssess'
      title='A fairer way to prove technical skills'
      description='DevAssess connects developers who want an honest measure of their skills with experienced engineers who know how to test them.'
    />

    <Section aria-labelledby='story-heading'>
      <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
        <div className='flex flex-col gap-4'>
          <span className='text-xs font-semibold tracking-widest text-primary uppercase'>Our story</span>
          <h2 id='story-heading' className='font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>
            Certificates say you attended. Assessments show you can.
          </h2>
          <p className='text-base leading-relaxed text-muted-foreground'>
            Hiring signals for developers are noisy: course certificates, self-rated skills and long take-home tasks. We
            wanted something shorter and more honest: focused, timed tests written by people who use the technology every
            day.
          </p>
          <p className='text-base leading-relaxed text-muted-foreground'>
            DevAssess is the marketplace for those tests. Evaluators publish what they know how to assess, developers pick
            exactly the skills they want to prove, and everyone sees the same pass mark.
          </p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          {VALUES.map((value) => (
            <InfoCard key={value.title} icon={value.icon} title={value.title}>
              {value.body}
            </InfoCard>
          ))}
        </div>
      </div>
    </Section>

    <StatsSection />

    <Section aria-labelledby='roles-heading'>
      <SectionHeading
        id='roles-heading'
        eyebrow='One platform, three roles'
        title='Everyone gets the tools they need'
        description='Each role has its own dashboard, built around the decisions that role makes.'
      />
      <div className='grid gap-5 md:grid-cols-3'>
        {ROLES.map((role) => (
          <InfoCard key={role.title} icon={role.icon} title={role.title}>
            {role.body}
          </InfoCard>
        ))}
      </div>
      <div className='mt-12 flex flex-wrap items-center justify-center gap-3'>
        <Link href='/register' className={buttonVariants({ size: 'lg' })}>
          Join DevAssess
          <ArrowRight />
        </Link>
        <Link href='/contact' className={buttonVariants({ variant: 'outline', size: 'lg' })}>
          Talk to us
        </Link>
      </div>
    </Section>
  </>
);

export default AboutView;
