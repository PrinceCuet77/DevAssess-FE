'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FieldError from '@/components/form/field-error';
import { changePasswordSchema } from '@/validation/auth.validation';
import { useChangePassword } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';

const FALLBACK_ERROR = 'Something went wrong. Please try again.';

const FIELDS = [
  { name: 'currentPassword', label: 'Current password', autoComplete: 'current-password' },
  { name: 'newPassword', label: 'New password', autoComplete: 'new-password' },
  { name: 'confirmPassword', label: 'Confirm new password', autoComplete: 'new-password' },
] as const;

const ChangePasswordForm = () => {
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const { mutate: changePassword, isPending } = useChangePassword();

  const form = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validators: { onChange: changePasswordSchema },
    onSubmit: ({ value }) => {
      changePassword(
        { currentPassword: value.currentPassword, newPassword: value.newPassword },
        {
          onSuccess: () => {
            toast.success('Password changed successfully.');
            form.reset();
          },
          onError: (error) => {
            toast.error(getApiErrorMessage(error, FALLBACK_ERROR));
          },
        },
      );
    },
  });

  return (
    <form
      className='flex flex-col gap-5'
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      {FIELDS.map(({ name, label, autoComplete }) => (
        <form.Field key={name} name={name}>
          {(field) => (
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor={field.name}>{label}</Label>
              <div className='relative'>
                <Lock className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  id={field.name}
                  name={field.name}
                  type={visible[name] ? 'text' : 'password'}
                  autoComplete={autoComplete}
                  placeholder='••••••••'
                  value={field.state.value}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  disabled={isPending}
                  className='h-11 pr-9 pl-8'
                />
                <button
                  type='button'
                  onClick={() => setVisible((prev) => ({ ...prev, [name]: !prev[name] }))}
                  disabled={isPending}
                  aria-label={visible[name] ? 'Hide password' : 'Show password'}
                  className='absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50'
                >
                  {visible[name] ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                </button>
              </div>
              {field.state.meta.isTouched && <FieldError errors={field.state.meta.errors} />}
            </div>
          )}
        </form.Field>
      ))}

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button
            type='submit'
            size='lg'
            className='h-11 w-full text-base'
            disabled={!canSubmit || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Updating…
              </>
            ) : (
              'Change password'
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};

export default ChangePasswordForm;
