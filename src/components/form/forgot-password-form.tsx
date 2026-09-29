'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from '@tanstack/react-form';
import { ArrowLeft, Loader2, Mail, MailCheck } from 'lucide-react';
import { FetchError } from 'ofetch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FieldError from '@/components/form/field-error';
import { forgotPasswordSchema } from '@/validation/auth.validation';
import { useForgotPassword } from '@/hooks';

const RESEND_COOLDOWN_SECONDS = 30;

const getErrorMessage = (error: unknown) => {
  if (error instanceof FetchError) {
    const data = error.data as { message?: string } | undefined;
    return data?.message ?? error.statusMessage ?? 'Something went wrong. Please try again.';
  }

  return 'Something went wrong. Please try again.';
};

const ForgetPasswordForm = () => {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const { mutate: forgetPassword, isPending } = useForgotPassword();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const form = useForm({
    defaultValues: { email: '' },
    validators: { onChange: forgotPasswordSchema },
    onSubmit: ({ value }) => {
      forgetPassword(
        { email: value.email },
        {
          onSuccess: () => {
            setSentTo(value.email);
            setCooldown(RESEND_COOLDOWN_SECONDS);
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        },
      );
    },
  });

  const handleResend = () => {
    if (!sentTo || cooldown > 0) return;

    forgetPassword(
      { email: sentTo },
      {
        onSuccess: () => {
          toast.success('Reset link sent again.');
          setCooldown(RESEND_COOLDOWN_SECONDS);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  if (sentTo) {
    return (
      <div className='flex flex-col items-center gap-5 text-center'>
        <span className='flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <MailCheck className='size-6' />
        </span>

        <div className='space-y-1.5'>
          <h2 className='font-heading text-lg font-semibold tracking-tight'>Check your email</h2>
          <p className='text-sm text-muted-foreground'>
            We&apos;ve sent a password reset link to{' '}
            <span className='font-medium text-foreground'>{sentTo}</span>. The link expires in 15
            minutes.
          </p>
        </div>

        <Button
          type='button'
          variant='outline'
          size='lg'
          className='h-11 w-full text-base'
          disabled={cooldown > 0 || isPending}
          onClick={handleResend}
        >
          {isPending ? (
            <>
              <Loader2 className='size-4 animate-spin' />
              Resending…
            </>
          ) : cooldown > 0 ? (
            `Resend email in ${cooldown}s`
          ) : (
            'Resend email'
          )}
        </Button>

        <div className='flex flex-col items-center gap-3'>
          <button
            type='button'
            onClick={() => {
              setSentTo(null);
              setCooldown(0);
              form.reset();
            }}
            className='text-xs font-medium text-muted-foreground hover:text-foreground hover:underline'
          >
            Use a different email
          </button>

          <Link
            href='/login'
            className='flex items-center gap-1.5 text-sm font-medium text-primary hover:underline'
          >
            <ArrowLeft className='size-3.5' />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

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
                autoFocus
                placeholder='you@example.com'
                value={field.state.value}
                aria-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={isPending}
                className='h-11 pl-8'
              />
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
            disabled={!canSubmit || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Sending link…
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        )}
      </form.Subscribe>

      <Link
        href='/login'
        className='flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground'
      >
        <ArrowLeft className='size-3.5' />
        Back to sign in
      </Link>
    </form>
  );
};

export default ForgetPasswordForm;
