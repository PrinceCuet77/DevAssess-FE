'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import GoogleAuthButton from '@/components/form/google-auth-button';
import FieldError from '@/components/form/field-error';
import { useRegister } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';

const registerSchema = z.object({
  email: z.email('Enter a valid email address'),
  role: z.enum(['developer', 'evaluator']),
  password: z.string().min(8, 'Use at least 8 characters'),
});

const ROLES = [
  {
    value: 'developer',
    title: 'Developer',
    description: 'Buy & take assessments',
  },
  {
    value: 'evaluator',
    title: 'Evaluator',
    description: 'Publish & sell assessments',
  },
] as const;

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: register } = useRegister();

  const form = useForm({
    defaultValues: {
      email: '',
      role: 'developer' as 'developer' | 'evaluator',
      password: '',
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: ({ value }) =>
      new Promise<void>((resolve) => {
        const email = value.email.trim().toLowerCase();
        register(
          { email, password: value.password, role: value.role.toUpperCase() },
          {
            onSuccess: () => {
              toast.success('Account created. Enter the code we emailed you.');
              router.push(`/verify-account?email=${encodeURIComponent(email)}`);
            },
            onError: (error) => {
              toast.error(getApiErrorMessage(error, 'Something went wrong. Please try again.'));
            },
            onSettled: () => resolve(),
          },
        );
      }),
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
      <form.Field name='role'>
        {(field) => (
          <div className='flex flex-col gap-1.5'>
            <Label>I want to</Label>
            <div role='radiogroup' className='grid grid-cols-2 gap-2'>
              {ROLES.map((role) => {
                const isActive = field.state.value === role.value;
                return (
                  <button
                    key={role.value}
                    type='button'
                    role='radio'
                    aria-checked={isActive}
                    onClick={() => field.handleChange(role.value)}
                    className={cn(
                      'rounded-lg border px-3 py-2.5 text-left transition-colors',
                      isActive
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-input hover:bg-muted',
                    )}
                  >
                    <p className='text-sm font-medium'>{role.title}</p>
                    <p className='text-xs text-muted-foreground'>{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </form.Field>

      <form.Field name='email'>
        {(field) => (
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor={field.name}>Email</Label>
            <div className='relative'>
              <Mail className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id={field.name}
                name={field.name}
                type='email'
                autoComplete='email'
                placeholder='you@example.com'
                value={field.state.value}
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                className='h-11 pl-8'
              />
            </div>
            {field.state.meta.isTouched && <FieldError errors={field.state.meta.errors} />}
          </div>
        )}
      </form.Field>

      <form.Field name='password'>
        {(field) => (
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor={field.name}>Password</Label>
            <div className='relative'>
              <Lock className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id={field.name}
                name={field.name}
                type={showPassword ? 'text' : 'password'}
                autoComplete='new-password'
                placeholder='••••••••'
                value={field.state.value}
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                className='h-11 pr-9 pl-8'
              />
              <button
                type='button'
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className='absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                {showPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
              </button>
            </div>
            {field.state.meta.isTouched && <FieldError errors={field.state.meta.errors} />}
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <Button
            type='submit'
            size='lg'
            className='h-11 w-full text-base'
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </Button>
        )}
      </form.Subscribe>

      <form.Subscribe selector={(state) => state.values.role}>
        {(role) =>
          role === 'developer' && (
            <>
              <div className='relative flex items-center py-1'>
                <span className='h-px flex-1 bg-border' />
                <span className='px-3 text-xs text-muted-foreground'>OR</span>
                <span className='h-px flex-1 bg-border' />
              </div>
              <GoogleAuthButton />
            </>
          )
        }
      </form.Subscribe>
    </form>
  );
};

export default RegisterForm;
