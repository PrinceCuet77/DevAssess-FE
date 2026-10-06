import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const AssessmentThumbnail = ({ src, className }: { src: string | null; className?: string }) => (
  <div
    className={cn(
      'flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground ring-1 ring-border/60',
      className,
    )}
  >
    {src ? (
      // eslint-disable-next-line @next/next/no-img-element -- remote URLs from the API, no configured image domains
      <img src={src} alt='' className='size-full object-cover' loading='lazy' />
    ) : (
      <FileText className='size-4' aria-hidden />
    )}
  </div>
);

export default AssessmentThumbnail;
