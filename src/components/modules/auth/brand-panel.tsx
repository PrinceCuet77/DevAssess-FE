import { ClipboardCheck, Rocket, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: ClipboardCheck,
    title: 'Buy & take real assessments',
    description: 'Browse the public catalog, purchase instantly, and get scored the moment you submit.',
  },
  {
    icon: Rocket,
    title: 'Publish & grow as an evaluator',
    description: 'Create paid assessments, see who buys them, and track your revenue from one dashboard.',
  },
  {
    icon: ShieldCheck,
    title: 'Fair, rubric-based scoring',
    description: 'Every attempt is measured against a clear rubric - objective signal, not guesswork.',
  },
];

type AuthBrandPanelProps = {
  title?: string;
  description?: string;
};

const AuthBrandPanel = ({
  title = 'Where verified skill gets you hired.',
  description = 'A marketplace where evaluators publish paid technical assessments and developers prove their skills by taking them.',
}: AuthBrandPanelProps) => {
  return (
    <div className='relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-12'>
      <div aria-hidden className='pointer-events-none absolute inset-0'>
        <div className='absolute -top-24 -left-24 size-96 rounded-full bg-white/10 blur-3xl' />
        <div className='absolute -right-16 -bottom-32 size-96 rounded-full bg-black/10 blur-3xl' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-primary-foreground)_1px,transparent_0)] bg-size-[24px_24px] opacity-[0.06]' />
      </div>

      <div className='relative z-10 max-w-md space-y-10'>
        <div className='space-y-3'>
          <h2 className='text-3xl font-heading font-semibold text-balance text-primary-foreground'>
            {title}
          </h2>
          <p className='text-balance text-primary-foreground/80'>{description}</p>
        </div>

        <ul className='space-y-6'>
          {features.map(({ icon: Icon, title, description }) => (
            <li key={title} className='flex gap-3'>
              <span className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground'>
                <Icon className='size-5' />
              </span>
              <div className='space-y-0.5'>
                <p className='text-sm font-medium text-primary-foreground'>{title}</p>
                <p className='text-sm text-primary-foreground/70'>{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className='relative z-10 text-xs text-primary-foreground/60'>
        © {new Date().getFullYear()} DevAssess. All rights reserved.
      </p>
    </div>
  );
};

export default AuthBrandPanel;
