import { FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';

type IProps = {
  active: boolean;
  onClear: () => void;
};

const ClearFiltersButton = ({ active, onClear }: IProps) => {
  if (!active) return null;
  return (
    <Button type='button' variant='outline' onClick={onClear}>
      <FilterX />
      Clear filters
    </Button>
  );
};

export default ClearFiltersButton;
