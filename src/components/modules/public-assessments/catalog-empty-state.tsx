import { PackageOpen, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

type IProps = {
  filtered: boolean;
  onClear: () => void;
};

const CatalogEmptyState = ({ filtered, onClear }: IProps) => {
  const Icon = filtered ? SearchX : PackageOpen;

  return (
    <div className='flex flex-col items-center gap-4 rounded-xl border border-dashed px-4 py-20 text-center'>
      <div className='flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary'>
        <Icon className='size-7' />
      </div>
      <div className='flex flex-col gap-1'>
        <h3 className='text-base font-semibold'>
          {filtered ? 'No assessments match your filters' : 'No assessments published yet'}
        </h3>
        <p className='max-w-sm text-sm text-muted-foreground'>
          {filtered
            ? 'Try a broader keyword, remove a topic or widen the price range.'
            : 'Evaluators are preparing new assessments. Check back soon.'}
        </p>
      </div>
      {filtered && (
        <Button variant='outline' onClick={onClear}>
          Clear all filters
        </Button>
      )}
    </div>
  );
};

export default CatalogEmptyState;
