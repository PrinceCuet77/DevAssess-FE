import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
};

const StatCard = ({ label, value, hint, icon: Icon }: StatCardProps) => (
  <Card>
    <CardContent className='flex items-start justify-between gap-3'>
      <div className='flex flex-col gap-1'>
        <span className='text-sm text-muted-foreground'>{label}</span>
        <span className='font-heading text-2xl font-semibold tracking-tight'>{value}</span>
        {hint && <span className='text-xs text-muted-foreground'>{hint}</span>}
      </div>
      <div className='flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
        <Icon className='size-4' />
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
