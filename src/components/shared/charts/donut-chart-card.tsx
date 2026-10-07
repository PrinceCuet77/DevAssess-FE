'use client';

import { Cell, Label, Pie, PieChart } from 'recharts';
import { PieChartIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

export type DonutSlice = { key: string; label: string; value: number };

type IProps = {
  title: string;
  description: string;
  slices: DonutSlice[];
  // Label under the centre total, e.g. "users".
  totalLabel: string;
};

// Categorical slots in fixed order, so a slice keeps its colour wherever it is rendered.
const SERIES = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)', 'var(--series-5)'];

const DonutChartCard = ({ title, description, slices, totalLabel }: IProps) => {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const config = Object.fromEntries(
    slices.map((s, i) => [s.key, { label: s.label, color: SERIES[i % SERIES.length] }]),
  ) satisfies ChartConfig;
  const data = slices.map((s) => ({ ...s, fill: `var(--color-${s.key})` }));

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col items-center gap-4'>
        {total === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center text-sm text-muted-foreground'>
            <PieChartIcon className='size-8 opacity-60' aria-hidden />
            Nothing to chart yet.
          </div>
        ) : (
          <>
            <ChartContainer config={config} className='aspect-square w-full max-w-[200px]'>
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey='key' />} />
                <Pie
                  data={data}
                  dataKey='value'
                  nameKey='key'
                  innerRadius='62%'
                  outerRadius='95%'
                  paddingAngle={slices.filter((s) => s.value > 0).length > 1 ? 2 : 0}
                  cornerRadius={4}
                  stroke='var(--card)'
                  strokeWidth={2}
                >
                  {data.map((d) => (
                    <Cell key={d.key} fill={d.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox)) return null;
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                          <tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground font-heading text-2xl font-semibold'>
                            {total.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 20} className='fill-muted-foreground text-xs'>
                            {totalLabel}
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Legend doubles as the accessible data table: identity never relies on colour alone. */}
            <ul className='grid w-full gap-2 text-sm' aria-label={`${title} breakdown`}>
              {slices.map((s) => {
                const pct = total ? Math.round((s.value / total) * 100) : 0;
                return (
                  <li key={s.key} className='flex items-center justify-between gap-3'>
                    <span className='flex min-w-0 items-center gap-2'>
                      <span
                        aria-hidden
                        className='size-2.5 shrink-0 rounded-sm'
                        style={{ background: config[s.key].color }}
                      />
                      <span className='truncate'>{s.label}</span>
                    </span>
                    <span className='flex items-baseline gap-2 tabular-nums'>
                      <span className='text-xs text-muted-foreground'>{pct}%</span>
                      <span className='font-medium'>{s.value.toLocaleString()}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DonutChartCard;
