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
        {rows.map((row) => (
          <div key={row.label} className='flex flex-col gap-1.5'>
            <div className='flex items-center justify-between text-sm'>
              <span>{row.label}</span>
              <span className='font-medium'>{row.value}</span>
            </div>
            <div className='h-2 overflow-hidden rounded-full bg-muted'>
              <div
                className='h-full rounded-full bg-primary'
                style={{ width: `${total ? (row.value / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StatusBreakdown;
