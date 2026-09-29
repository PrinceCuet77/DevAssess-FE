'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from '@tanstack/react-form';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { FetchError } from 'ofetch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GoogleIcon from '@/components/form/google-icon';
import FieldError from '@/components/form/field-error';
import { loginUserSchema } from '@/validation/auth.validation';
import { toast } from 'sonner';
import { useLogin } from '@/hooks';
import { useRouter } from 'next/navigation';

const getErrorMessage = (error: unknown) => {
  if (error instanceof FetchError) {
    const data = error.data as { message?: string } | undefined;
    return (
      data?.message ?? error.statusMessage ?? 'Login failed. Please try again.'
    );
  }

  return 'Login failed. Please try again.';
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const { mutate: login, isPending: loginPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: 'admin@devassess.com',
      password: 'Password@123',
    },
    validators: {
      onChange: loginUserSchema,
    },
    onSubmit: ({ value }) => {
      const loginData = {
        email: value.email,
        password: value.password,
      };

      login(loginData, {
        onSuccess: () => {
          toast.success('Login successful!');
          router.replace('/');
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      });
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
                aria-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={loginPending}
                className='h-11 pl-8'
              />
            </div>
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
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
                aria-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={loginPending}
                className='h-11 pr-9 pl-8'
              />
              <button
                type='button'
                onClick={() => setShowPassword((value) => !value)}
                disabled={loginPending}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className='absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50'
              >
                {showPassword ? (
                  <EyeOff className='size-4' />
                ) : (
                  <Eye className='size-4' />
                )}
              </button>
            </div>
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button
            type='submit'
            size='lg'
            className='h-11 w-full text-base'
            disabled={!canSubmit || loginPending}
          >
            {loginPending ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Signing in
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

      <Button
        type='button'
        variant='outline'
        size='lg'
        className='h-11 w-full gap-2 text-base'
      >
        <GoogleIcon className='size-4' />
        Continue with Google
      </Button>

      <p className='text-center text-xs text-muted-foreground'>
        By continuing, you agree to DevAssess&apos;s{' '}
        <Link
          href='/terms'
          className='font-medium text-foreground hover:underline'
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='/privacy'
          className='font-medium text-foreground hover:underline'
        >
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
};

export default LoginForm;
