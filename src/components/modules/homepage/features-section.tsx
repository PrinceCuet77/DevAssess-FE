import { BarChart3, Clock, LockKeyhole, MonitorSmartphone, ShieldCheck, Star } from 'lucide-react';
import { InfoCard, Section, SectionHeading } from '@/components/layout/public/marketing-section';

const FEATURES = [
  { icon: Clock, title: 'Timed and focused', body: 'Every assessment has a fixed time limit, so results reflect what you know under real pressure.' },
  { icon: ShieldCheck, title: 'Answer keys stay private', body: 'Questions and correct answers are never exposed in the catalog. Scores are computed on the server.' },
  { icon: LockKeyhole, title: 'Secure checkout', body: 'Payments run through SSLCommerz in BDT, and every transaction is listed in your payment history.' },
  { icon: Star, title: 'Honest reviews', body: 'Reviews are written by developers who bought the assessment, so ratings come from people who actually took it.' },
  { icon: BarChart3, title: 'Role-based dashboards', body: 'Developers, evaluators and admins each get the numbers that matter to them, with charts and tables.' },
  { icon: MonitorSmartphone, title: 'Works everywhere', body: 'Fully responsive with light and dark themes, from a phone on the commute to a wide desktop monitor.' },
];

const FeaturesSection = () => (
  <Section aria-labelledby='features-heading'>
    <SectionHeading
      id='features-heading'
      eyebrow='Why DevAssess'
      title='Everything you need to assess skills fairly'
      description='A marketplace designed around trustworthy results, for the people taking tests and the people writing them.'
    />
    <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
      {FEATURES.map((feature) => (
        <InfoCard key={feature.title} icon={feature.icon} title={feature.title}>
          {feature.body}
        </InfoCard>
      ))}
    </div>
  </Section>
);

export default FeaturesSection;
