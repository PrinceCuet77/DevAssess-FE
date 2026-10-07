'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

type IProps = {
  value?: string;
  onChange: (search: string | undefined) => void;
};

const CatalogSearch = ({ value, onChange }: IProps) => {
  const [search, setSearch] = useState(value ?? '');
  const [prevValue, setPrevValue] = useState(value);

  // Keep the input in sync when the URL changes elsewhere (e.g. "Clear all").
  if (value !== prevValue) {
    setPrevValue(value);
    if ((value ?? '') !== search.trim()) setSearch(value ?? '');
  }

  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === (value ?? '')) return;
    const timer = setTimeout(() => onChange(trimmed || undefined), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onChange only reads the live URL
  }, [search, value]);

  return (
    <form
      role='search'
      className='relative w-full max-w-2xl'
      onSubmit={(e) => {
        e.preventDefault();
        onChange(search.trim() || undefined);
      }}
    >
      <Search className='pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground' />
      <Input
        type='search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Search by title, topic or tag - e.g. React, SQL, system design'
        aria-label='Search assessments'
        className='h-12 rounded-xl bg-background pr-11 pl-11 text-base shadow-sm md:text-base dark:bg-background/60 [&::-webkit-search-cancel-button]:hidden'
      />
      {search && (
        <button
          type='button'
          aria-label='Clear search'
          onClick={() => {
            setSearch('');
            onChange(undefined);
          }}
          className='absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50'
        >
          <X className='size-4' />
        </button>
      )}
    </form>
  );
};

export default CatalogSearch;
