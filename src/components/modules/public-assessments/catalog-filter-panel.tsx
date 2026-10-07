'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CatalogQuery } from '@/types/assessment.types';

type IProps = {
  query: CatalogQuery;
  suggestedTags: string[];
  onChange: (patch: Partial<CatalogQuery>) => void;
};

const toPrice = (value: string) => {
  if (value.trim() === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
};

const PriceFilter = ({ query, onChange }: Omit<IProps, 'suggestedTags'>) => {
  const [min, setMin] = useState(query.minPrice?.toString() ?? '');
  const [max, setMax] = useState(query.maxPrice?.toString() ?? '');
  const [synced, setSynced] = useState([query.minPrice, query.maxPrice]);
  const [error, setError] = useState<string | null>(null);

  // Reset the inputs when the URL changes elsewhere (chip removal, "Clear all").
  if (synced[0] !== query.minPrice || synced[1] !== query.maxPrice) {
    setSynced([query.minPrice, query.maxPrice]);
    setMin(query.minPrice?.toString() ?? '');
    setMax(query.maxPrice?.toString() ?? '');
    setError(null);
  }

  const apply = () => {
    const minPrice = toPrice(min);
    const maxPrice = toPrice(max);
    if (Number.isNaN(minPrice) || Number.isNaN(maxPrice)) return setError('Prices must be 0 or more.');
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
      return setError('Minimum can’t be higher than maximum.');
    setError(null);
    onChange({ minPrice, maxPrice });
  };

  return (
    <form
      className='flex flex-col gap-3'
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      <div className='grid grid-cols-2 gap-2'>
        <div className='flex flex-col gap-1.5'>
          <Label htmlFor='minPrice' className='text-xs text-muted-foreground'>
            Min (BDT)
          </Label>
          <Input
            id='minPrice'
            type='number'
            inputMode='decimal'
            min={0}
            placeholder='0'
            value={min}
            aria-invalid={Boolean(error)}
            onChange={(e) => setMin(e.target.value)}
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label htmlFor='maxPrice' className='text-xs text-muted-foreground'>
            Max (BDT)
          </Label>
          <Input
            id='maxPrice'
            type='number'
            inputMode='decimal'
            min={0}
            placeholder='Any'
            value={max}
            aria-invalid={Boolean(error)}
            onChange={(e) => setMax(e.target.value)}
          />
        </div>
      </div>
      {error && (
        <p role='alert' className='text-xs text-destructive'>
          {error}
        </p>
      )}
      <Button type='submit' variant='outline' size='sm'>
        Apply price
      </Button>
    </form>
  );
};

const TagFilter = ({ query, suggestedTags, onChange }: IProps) => {
  const [draft, setDraft] = useState('');
  const selected = query.tags ?? [];
  const suggestions = suggestedTags.filter((t) => !selected.includes(t));

  const add = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !selected.includes(tag)) onChange({ tags: [...selected, tag] });
    setDraft('');
  };
  const remove = (tag: string) => onChange({ tags: selected.filter((t) => t !== tag) });

  return (
    <div className='flex flex-col gap-3'>
      <form
        className='flex gap-2'
        onSubmit={(e) => {
          e.preventDefault();
          add(draft);
        }}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder='Add a topic, e.g. node'
          aria-label='Add a topic filter'
        />
        <Button type='submit' variant='outline' size='icon' aria-label='Add topic' disabled={!draft.trim()}>
          <Plus />
        </Button>
      </form>

      {selected.length > 0 && (
        <ul className='flex flex-wrap gap-1.5' aria-label='Selected topics'>
          {selected.map((tag) => (
            <li key={tag}>
              <button
                type='button'
                onClick={() => remove(tag)}
                aria-label={`Remove ${tag}`}
                className='inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground outline-none hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50'
              >
                {tag}
                <X className='size-3' />
              </button>
            </li>
          ))}
        </ul>
      )}

      {suggestions.length > 0 && (
        <div className='flex flex-col gap-2'>
          <p className='text-xs text-muted-foreground'>Popular in these results</p>
          <ul className='flex flex-wrap gap-1.5'>
            {suggestions.map((tag) => (
              <li key={tag}>
                <button
                  type='button'
                  onClick={() => add(tag)}
                  className='rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors outline-none hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50'
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selected.length > 1 && (
        <p className='text-xs text-muted-foreground'>Showing assessments that match any selected topic.</p>
      )}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className='flex flex-col gap-3 border-b border-border/60 pb-5 last:border-b-0 last:pb-0'>
    <h3 className='text-sm font-semibold'>{title}</h3>
    {children}
  </section>
);

const CatalogFilterPanel = (props: IProps) => (
  <div className='flex flex-col gap-5'>
    <Section title='Topics'>
      <TagFilter {...props} />
    </Section>
    <Section title='Price'>
      <PriceFilter query={props.query} onChange={props.onChange} />
    </Section>
  </div>
);

export default CatalogFilterPanel;
