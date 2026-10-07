// Public contact details and social profiles, shown in the footer and on the contact page.
export const SITE = {
  name: 'DevAssess',
  tagline: 'The marketplace for expert-built technical assessments.',
  email: 'support@devassess.com',
  address: 'Dhaka, Bangladesh',
  hours: 'Sun – Thu, 10:00 – 18:00 (GMT+6)',
} as const;

export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/devassess', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/devassess', icon: 'linkedin' },
  { label: 'X (Twitter)', href: 'https://x.com/devassess', icon: 'x' },
  { label: 'Facebook', href: 'https://www.facebook.com/devassess', icon: 'facebook' },
] as const;

export type SocialIcon = (typeof SOCIAL_LINKS)[number]['icon'];
