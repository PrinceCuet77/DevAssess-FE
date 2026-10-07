import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { type LegalSection } from '@/components/layout/public/legal-page';
import { SITE } from '@/constants/site';

export const metadata: Metadata = {
  title: 'Privacy policy | DevAssess',
  description: 'How DevAssess collects, uses and protects your personal data.',
};

const SECTIONS: LegalSection[] = [
  {
    heading: 'Information we collect',
    body: (
      <>
        <p>We collect only what we need to run the marketplace:</p>
        <ul>
          <li>Account details: your email address, role, and a password hash (or your Google account identifier if you sign in with Google).</li>
          <li>Profile details you choose to add: name, profession, company, years of experience, bio, skills and avatar.</li>
          <li>Marketplace activity: orders, payment status, assessment attempts, scores and the reviews you write.</li>
        </ul>
      </>
    ),
  },
  {
    heading: 'How we use it',
    body: (
      <ul>
        <li>To sign you in and keep your session secure.</li>
        <li>To deliver purchased assessments, grade attempts and show your results.</li>
        <li>To show evaluators sales and attempt statistics for their own assessments.</li>
        <li>To let administrators keep the marketplace safe, for example by suspending abusive accounts.</li>
      </ul>
    ),
  },
  {
    heading: 'Payments',
    body: (
      <p>
        Payments are processed by SSLCommerz. We never see or store your full card or mobile banking details; we keep
        only the transaction ID, amount, method and status returned by the gateway.
      </p>
    ),
  },
  {
    heading: 'What others can see',
    body: (
      <p>
        Your name appears next to reviews you publish and, for evaluators, on the assessments you create. Email addresses
        are never shown on public pages. Evaluators can see the name and email of developers who purchase their assessments.
      </p>
    ),
  },
  {
    heading: 'Cookies',
    body: (
      <p>
        We use a secure, HTTP-only authentication cookie to keep you signed in. Your light/dark theme preference is stored
        in your browser. We do not use advertising or third-party tracking cookies.
      </p>
    ),
  },
  {
    heading: 'Your choices',
    body: (
      <p>
        You can edit your profile at any time and delete your account from the{' '}
        <Link href='/profile'>profile page</Link>. Deleting your account removes your profile; records needed for completed
        payments may be retained where the law requires it.
      </p>
    ),
  },
  {
    heading: 'Contact',
    body: (
      <p>
        Questions about your data? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or use the{' '}
        <Link href='/contact'>contact form</Link>.
      </p>
    ),
  },
];

const PrivacyPage = () => (
  <LegalPage
    title='Privacy policy'
    description='What we collect, why we collect it, and the choices you have.'
    updated='October 7, 2026'
    sections={SECTIONS}
  />
);

export default PrivacyPage;
