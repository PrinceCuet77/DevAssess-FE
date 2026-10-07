import { coverGradient } from '@/components/modules/public-assessments/catalog-utils';
import { cn } from '@/lib/utils';

type IProps = {
  id: string;
  title: string;
  tags: string[];
  src: string | null;
  className?: string;
  eager?: boolean;
};

// Thumbnail, or a generated cover (gradient + primary tag) when the evaluator didn't upload one.
const AssessmentCover = ({ id, title, tags, src, className, eager }: IProps) => (
  <div className={cn('relative overflow-hidden bg-muted', className)}>
    {src ? (
      // eslint-disable-next-line @next/next/no-img-element -- remote URLs from the API, no configured image domains
      <img
        src={src}
        alt=''
        loading={eager ? 'eager' : 'lazy'}
        className='size-full object-cover transition-transform duration-500 group-hover:scale-105'
      />
    ) : (
      <div
        className={cn('flex size-full items-center justify-center bg-gradient-to-br p-6', coverGradient(id))}
        aria-hidden
      >
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--foreground)_1px,transparent_0)] [background-size:18px_18px] opacity-[0.07]' />
        <span className='relative line-clamp-2 text-center font-mono text-lg font-semibold tracking-tight text-foreground/70'>
          {tags[0] ? `#${tags[0]}` : title}
        </span>
      </div>
    )}
  </div>
);

export default AssessmentCover;
