import FieldError from '@/components/form/field-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  errors: unknown[];
  className?: string;
  children: React.ReactNode;
};

// Label + control + hint/error, so every input on the form is laid out the same way.
const Field = ({ id, label, hint, required, errors, className, children }: FieldProps) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <Label htmlFor={id}>
      {label}
      {required && <span className='text-destructive'>*</span>}
    </Label>
    {children}
    {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
    <FieldError errors={errors} />
  </div>
);

export default Field;
