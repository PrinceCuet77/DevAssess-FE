'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

export type BarDatum = { label: string; value: number };

type IProps = {
  title: string;
  description: string;
  data: BarDatum[];
  // Series name shown in the tooltip, e.g. "Purchases".
  valueLabel: string;
  // Horizontal bars suit long category names such as assessment titles.
  layout?: 'vertical' | 'horizontal';
  formatValue?: (value: number) => string;
};

const truncate = (value: string, max: number) => (value.length > max ? `${value.slice(0, max - 1)}…` : value);

const BarChartCard = ({ title, description, data, valueLabel, layout = 'vertical', formatValue }: IProps) => {
  const config = { value: { label: valueLabel, color: 'var(--series-1)' } } satisfies ChartConfig;
  const isEmpty = data.length === 0 || data.every((d) => d.value === 0);
  const horizontal = layout === 'horizontal';

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col'>
        {isEmpty ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center text-sm text-muted-foreground'>
            <BarChart3 className='size-8 opacity-60' aria-hidden />
            Nothing to chart yet.
          </div>
        ) : (
          <ChartContainer
            config={config}
            className='w-full'
            style={{ height: horizontal ? Math.max(data.length * 44, 160) : 240, aspectRatio: 'auto' }}
          >
            {horizontal ? (
              <BarChart data={data} layout='vertical' margin={{ left: 4, right: 16 }} barCategoryGap={8}>
                <CartesianGrid horizontal={false} strokeDasharray='3 3' />
                <XAxis type='number' allowDecimals={false} tickLine={false} axisLine={false} tickFormatter={formatValue} />
                <YAxis
                  type='category'
                  dataKey='label'
                  width={120}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: string) => truncate(v, 16)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent formatter={formatValue && ((v) => `${valueLabel}: ${formatValue(Number(v))}`)} />}
                />
                <Bar dataKey='value' fill='var(--color-value)' radius={[0, 4, 4, 0]} maxBarSize={28} />
              </BarChart>
            ) : (
              <BarChart data={data} margin={{ top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray='3 3' />
                <XAxis
                  dataKey='label'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0}
                  tickFormatter={(v: string) => truncate(v, 12)}
                />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} tickFormatter={formatValue} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent formatter={formatValue && ((v) => `${valueLabel}: ${formatValue(Number(v))}`)} />}
                />
                <Bar dataKey='value' fill='var(--color-value)' radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartCard;
