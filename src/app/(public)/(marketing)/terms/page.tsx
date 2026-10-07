import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { type LegalSection } from '@/components/layout/public/legal-page';
import { SITE } from '@/constants/site';

export const metadata: Metadata = {
  title: 'Terms of service - DevAssess',
  description: 'The rules for using the DevAssess marketplace as a developer or evaluator.',
};

const SECTIONS: LegalSection[] = [
  {
    heading: 'Using DevAssess',
    body: (
      <p>
        By creating an account you agree to these terms. You must provide a valid email address, keep your password safe
        and be responsible for activity on your account.
      </p>
    ),
  },
  {
    heading: 'Developer accounts',
    body: (
      <ul>
        <li>Purchases are one-time payments in BDT and give you personal access to the assessment, including retakes.</li>
        <li>Attempts must be your own work. Sharing questions or answers outside the platform is not allowed.</li>
        <li>Reviews should reflect your genuine experience of the assessment.</li>
      </ul>
    ),
  },
  {
    heading: 'Evaluator accounts',
    body: (
      <ul>
        <li>You must own the rights to the questions, descriptions and thumbnails you publish.</li>
        <li>Assessments must be accurate, with one correct option per question and a fair time limit.</li>
        <li>You set your own prices; changes apply to new orders only.</li>
      </ul>
    ),
  },
  {
    heading: 'Payments',
    body: (
      <p>
        Payments are processed by SSLCommerz. An order counts as paid only once the gateway confirms a successful payment.
        If a payment fails or is cancelled you can retry it from your Purchases page.
      </p>
    ),
  },
  {
    heading: 'Moderation',
    body: (
      <p>
        Administrators may suspend accounts that break these terms, for example by sharing answer keys, posting abusive
        reviews or publishing content they do not own.
      </p>
    ),
  },
  {
    heading: 'Changes and contact',
    body: (
      <p>
        We may update these terms as the marketplace grows and will change the date above when we do. Questions? Email{' '}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or visit the <Link href='/help'>help center</Link>.
      </p>
    ),
  },
];

const TermsPage = () => (
  <LegalPage
    title='Terms of service'
    description='The rules that keep the marketplace fair for developers and evaluators.'
    updated='October 7, 2026'
    sections={SECTIONS}
  />
);

export default TermsPage;
