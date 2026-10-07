import Link from 'next/link';
import { Section, SectionHeading } from '@/components/layout/public/marketing-section';
import FaqList from '@/components/shared/faq-list';
import { HOME_FAQ } from '@/constants/faq';

const FaqSection = () => (
  <Section aria-labelledby='faq-heading'>
    <div className='grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16'>
      <div>
        <SectionHeading
          id='faq-heading'
          eyebrow='FAQ'
          title='Questions, answered'
          description='The essentials about buying, taking and publishing assessments.'
          align='left'
        />
        <p className='-mt-4 text-sm text-muted-foreground'>
          Need more detail? Visit the{' '}
          <Link href='/help' className='font-medium text-primary hover:underline'>
            help center
          </Link>{' '}
          or{' '}
          <Link href='/contact' className='font-medium text-primary hover:underline'>
            contact us
          </Link>
          .
        </p>
      </div>
      <FaqList items={HOME_FAQ} />
    </div>
  </Section>
);

export default FaqSection;
