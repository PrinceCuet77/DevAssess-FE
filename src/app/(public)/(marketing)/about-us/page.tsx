import type { Metadata } from 'next';
import AboutView from '@/components/modules/about/about-view';

export const metadata: Metadata = {
  title: 'About us - DevAssess',
  description: 'Why we built DevAssess and how the marketplace works for developers, evaluators and admins.',
};

const AboutUsPage = () => <AboutView />;

export default AboutUsPage;
