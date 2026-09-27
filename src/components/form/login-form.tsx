'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean(),
});

function GoogleIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' {...props}>
      <path
        fill='#4285F4'
        d='M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.55-5.17 3.55-8.66Z'
      />
      <path
        fill='#34A853'
        d='M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11A12 12 0 0 0 12 24Z'
      />
      <path
        fill='#FBBC05'
        d='M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.28a12 12 0 0 0 0 10.8l3.99-3.11Z'
      />
      <path
        fill='#EA4335'
        d='M12 4.75c1.76 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.6l3.99 3.11C6.22 6.86 8.87 4.75 12 4.75Z'
      />
    </svg>
  );
}

function FieldError({ errors }: { errors: unknown[] }) {
  const message = errors
    .map((error) => {
      if (typeof error === 'string') return error;
      if (error && typeof error === 'object' && 'message' in error) return String(error.message);
      return null;
    })
    .filter(Boolean)
    .join(', ');

  if (!message) return null;
  return <p className='text-xs text-destructive'>{message}</p>;
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      // TODO: replace with a TanStack Query mutation calling POST /auth/login via apiClient.
      console.log('login submit', value);
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
            <div className='flex items-center justify-between'>
              <Label htmlFor={field.name}>Password</Label>
              <Link
                href='/forgot-password'
                className='text-xs font-medium text-primary hover:underline'
              >
                Forgot password?
              </Link>
            </div>
            <div className='relative'>
              <Lock className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id={field.name}
                name={field.name}
                type={showPassword ? 'text' : 'password'}
                autoComplete='current-password'
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

      <form.Field name='remember'>
        {(field) => (
          <label className='flex w-fit items-center gap-2 text-sm text-muted-foreground select-none'>
            <Checkbox
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked)}
            />
            Remember me
          </label>
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
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        )}
      </form.Subscribe>

      <div className='relative flex items-center py-1'>
        <span className='h-px flex-1 bg-border' />
        <span className='px-3 text-xs text-muted-foreground'>OR</span>
        <span className='h-px flex-1 bg-border' />
      </div>

      <Button type='button' variant='outline' size='lg' className='h-11 w-full gap-2 text-base'>
        <GoogleIcon className='size-4' />
        Continue with Google
      </Button>

      <p className='text-center text-xs text-muted-foreground'>
        By continuing, you agree to DevAssess&apos;s{' '}
        <Link href='/terms' className='font-medium text-foreground hover:underline'>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href='/privacy' className='font-medium text-foreground hover:underline'>
          Privacy Policy
        </Link>
        .
      </p>

      <p className='text-center text-sm text-muted-foreground'>
        Don&apos;t have an account?{' '}
        <Link href='/register' className='font-medium text-primary hover:underline'>
          Create one
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
