import type { Metadata } from 'next';
import ContactView from '@/components/modules/contact/contact-view';

export const metadata: Metadata = {
  title: 'Contact | DevAssess',
  description: 'Get in touch with the DevAssess team about payments, publishing, your account or feedback.',
};

const ContactPage = () => <ContactView />;

export default ContactPage;
