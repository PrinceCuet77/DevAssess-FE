import type { Metadata } from 'next';
import AudienceSection from '@/components/modules/homepage/audience-section';
import CtaSection from '@/components/modules/homepage/cta-section';
import FaqSection from '@/components/modules/homepage/faq-section';
import FeaturedSection from '@/components/modules/homepage/featured-section';
import FeaturesSection from '@/components/modules/homepage/features-section';
import HeroSection from '@/components/modules/homepage/hero';
import HowItWorksSection from '@/components/modules/homepage/how-it-works-section';
import StatsSection from '@/components/modules/homepage/stats-section';
import TestimonialsSection from '@/components/modules/homepage/testimonials-section';
import TopicsSection from '@/components/modules/homepage/topics-section';

export const metadata: Metadata = {
  title: 'DevAssess - Expert-built technical assessments',
  description:
    'Buy timed technical assessments built by expert evaluators, prove your skills, and track your progress.',
};

const HomePage = () => (
  <>
    <HeroSection />
    <StatsSection />
    <FeaturedSection />
    <TopicsSection />
    <HowItWorksSection />
    <AudienceSection />
    <FeaturesSection />
    <TestimonialsSection />
    <FaqSection />
    <CtaSection />
  </>
);

export default HomePage;
