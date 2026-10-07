import Link from 'next/link';
import { Clock, LifeBuoy, Mail, MapPin } from 'lucide-react';
import { PageHero, Section } from '@/components/layout/public/marketing-section';
import ContactForm from '@/components/modules/contact/contact-form';
import SocialIcon from '@/components/shared/social-icon';
import { SITE, SOCIAL_LINKS } from '@/constants/site';

const DETAILS = [
  { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MapPin, label: 'Location', value: SITE.address },
  { icon: Clock, label: 'Support hours', value: SITE.hours },
];

const ContactView = () => (
  <>
    <PageHero
      eyebrow='Contact'
      title='We’re here to help'
      description='Questions about a payment, publishing an assessment or your account? Send us a message and we’ll get back to you within one business day.'
    />
    <Section>
      <div className='grid gap-8 lg:grid-cols-[1.5fr_1fr]'>
        <div className='rounded-2xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8'>
          <h2 className='font-heading text-xl font-semibold tracking-tight'>Send us a message</h2>
          <p className='mt-1 mb-6 text-sm text-muted-foreground'>Fields marked * are required.</p>
          <ContactForm />
        </div>

        <aside className='flex flex-col gap-4' aria-label='Contact details'>
          {DETAILS.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className='flex items-start gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10'>
              <span className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <Icon className='size-5' aria-hidden />
              </span>
              <div className='flex min-w-0 flex-col gap-0.5'>
                <span className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>{label}</span>
                {href ? (
                  <a href={href} className='truncate text-sm font-medium hover:text-primary hover:underline'>
                    {value}
                  </a>
                ) : (
                  <span className='text-sm font-medium'>{value}</span>
                )}
              </div>
            </div>
          ))}

          <div className='flex flex-col gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10'>
            <span className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>Follow us</span>
            <ul className='flex flex-wrap gap-2'>
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary'
                  >
                    <SocialIcon name={social.icon} className='size-4' />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href='/help'
            className='flex items-start gap-4 rounded-xl bg-primary/10 p-5 ring-1 ring-primary/20 transition-colors hover:bg-primary/15'
          >
            <LifeBuoy className='mt-0.5 size-5 shrink-0 text-primary' aria-hidden />
            <span className='flex flex-col gap-0.5'>
              <span className='text-sm font-semibold'>Looking for a quick answer?</span>
              <span className='text-sm text-muted-foreground'>The help center covers payments, attempts and publishing.</span>
            </span>
          </Link>
        </aside>
      </div>
    </Section>
  </>
);

export default ContactView;
