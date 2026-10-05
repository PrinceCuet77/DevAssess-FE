import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type StatusBreakdownProps = {
  title: string;
  description: string;
  rows: { label: string; value: number }[];
};

const StatusBreakdown = ({ title, description, rows }: StatusBreakdownProps) => {
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        {rows.map((row) => {
          const percent = total ? (row.value / total) * 100 : 0;
          return (
            <div key={row.label} className='flex flex-col gap-1.5'>
              <div className='flex items-center justify-between gap-2 text-sm'>
                <span>{row.label}</span>
                <span className='flex items-baseline gap-2 tabular-nums'>
                  <span className='text-xs text-muted-foreground'>{percent.toFixed(0)}%</span>
                  <span className='font-medium'>{row.value}</span>
                </span>
              </div>
              <div className='h-2 overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-[width] duration-500'
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default StatusBreakdown;
