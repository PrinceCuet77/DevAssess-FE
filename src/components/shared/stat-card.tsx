import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
};

const StatCard = ({ label, value, hint, icon: Icon }: StatCardProps) => (
  <Card className='group relative overflow-hidden transition-colors hover:ring-primary/40'>
    <div className='pointer-events-none absolute -top-10 -right-10 size-28 rounded-full bg-primary/5 blur-2xl transition-colors group-hover:bg-primary/15' />
    <CardContent className='relative flex items-start justify-between gap-3'>
      <div className='flex min-w-0 flex-col gap-1'>
        <span className='truncate text-sm text-muted-foreground'>{label}</span>
        <span className='font-heading text-2xl font-semibold tracking-tight tabular-nums'>
          {value}
        </span>
        {hint && <span className='truncate text-xs text-muted-foreground'>{hint}</span>}
      </div>
      <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20'>
        <Icon className='size-5' />
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
