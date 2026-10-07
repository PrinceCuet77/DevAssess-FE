import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '@/constants/faq';

// Native <details> keeps the accordion keyboard- and screen-reader-friendly with no JS.
const FaqList = ({ items }: { items: FaqItem[] }) => (
  <div className='divide-y divide-border/60 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10'>
    {items.map((item) => (
      <details key={item.question} className='group'>
        <summary className='flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium outline-none hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset sm:text-base [&::-webkit-details-marker]:hidden'>
          {item.question}
          <ChevronDown className='size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180' aria-hidden />
        </summary>
        <p className='px-5 pb-5 text-sm leading-relaxed text-muted-foreground'>{item.answer}</p>
      </details>
    ))}
  </div>
);

export default FaqList;
