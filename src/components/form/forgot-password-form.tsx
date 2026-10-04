'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  MailCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FieldError from '@/components/form/field-error';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  OTP_LENGTH,
} from '@/validation/auth.validation';
import { useForgotPassword, useResetPassword } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';

// Backend keeps the OTP in Redis for 5 minutes; a new one can only be requested after that.
const OTP_EXPIRY_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = OTP_EXPIRY_SECONDS;

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const FALLBACK_ERROR = 'Something went wrong. Please try again.';

const ForgotPasswordForm = () => {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [expiresIn, setExpiresIn] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

  const isExpired = sentTo !== null && expiresIn <= 0;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (expiresIn <= 0) return;
    const timer = setInterval(() => setExpiresIn((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [expiresIn]);

  const form = useForm({
    defaultValues: { email: '' },
    validators: { onChange: forgotPasswordSchema },
    onSubmit: ({ value }) => {
      forgotPassword(
        { email: value.email },
        {
          onSuccess: () => {
            setSentTo(value.email);
            setCooldown(RESEND_COOLDOWN_SECONDS);
            setExpiresIn(OTP_EXPIRY_SECONDS);
          },
          onError: (error) => {
            toast.error(getApiErrorMessage(error, FALLBACK_ERROR));
          },
        },
      );
    },
  });

  const resetForm = useForm({
    defaultValues: { otp: '', newPassword: '' },
    validators: { onChange: resetPasswordSchema },
    onSubmit: ({ value }) => {
      if (!sentTo || isExpired) return;

      resetPassword(
        { email: sentTo, otp: value.otp, newPassword: value.newPassword },
        {
          onSuccess: () => {
            toast.success('Password reset successfully. Please sign in.');
            router.push('/login');
          },
          onError: (error) => {
            toast.error(getApiErrorMessage(error, FALLBACK_ERROR));
          },
        },
      );
    },
  });

  const handleResend = () => {
    if (!sentTo || cooldown > 0) return;

    forgotPassword(
      { email: sentTo },
      {
        onSuccess: () => {
          toast.success('A new code has been sent.');
          setCooldown(RESEND_COOLDOWN_SECONDS);
          setExpiresIn(OTP_EXPIRY_SECONDS);
          resetForm.reset();
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, FALLBACK_ERROR));
        },
      },
    );
  };

  if (sentTo) {
    return (
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col items-center gap-3 text-center'>
          <span className='flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
            <MailCheck className='size-6' />
          </span>
          <div className='space-y-1.5'>
            <h2 className='font-heading text-lg font-semibold tracking-tight'>
              Check your email
            </h2>
            <p className='text-sm text-muted-foreground'>
              We&apos;ve sent a {OTP_LENGTH}-digit code to{' '}
              <span className='font-medium text-foreground'>{sentTo}</span>.
              Enter it below with your new password.
            </p>
          </div>
        </div>

        <form
          className='flex flex-col gap-5'
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            resetForm.handleSubmit();
          }}
        >
          <resetForm.Field name='otp'>
            {(field) => (
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor={field.name}>Verification code</Label>
                <div className='relative'>
                  <KeyRound className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    id={field.name}
                    name={field.name}
                    inputMode='numeric'
                    autoComplete='one-time-code'
                    autoFocus
                    maxLength={OTP_LENGTH}
                    placeholder={'0'.repeat(OTP_LENGTH)}
                    value={field.state.value}
                    aria-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value.replace(/\D/g, ''))
                    }
                    disabled={isResetting}
                    className='h-11 pl-8 tracking-[0.4em]'
                  />
                </div>
                {field.state.meta.isTouched && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          </resetForm.Field>

          <resetForm.Field name='newPassword'>
            {(field) => (
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor={field.name}>New password</Label>
                <div className='relative'>
                  <Lock className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='new-password'
                    placeholder='••••••••'
                    value={field.state.value}
                    aria-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    disabled={isResetting}
                    className='h-11 pr-9 pl-8'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={isResetting}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
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
          </resetForm.Field>

          <resetForm.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <Button
                type='submit'
                size='lg'
                className='h-11 w-full text-base'
                disabled={!canSubmit || isResetting || isExpired}
              >
                {isResetting ? (
                  <>
                    <Loader2 className='size-4 animate-spin' />
                    Resetting…
                  </>
                ) : (
                  'Reset password'
                )}
              </Button>
            )}
          </resetForm.Subscribe>
        </form>

        <div className='flex flex-col items-center gap-3 text-center'>
          <button
            type='button'
            className='text-sm font-medium text-primary hover:underline disabled:pointer-events-none disabled:text-muted-foreground'
            disabled={cooldown > 0 || isPending}
            onClick={handleResend}
          >
            {isPending
              ? 'Resending…'
              : cooldown > 0
                ? `Resend code in ${formatTime(cooldown)}`
                : isExpired
                  ? 'Get a new code'
                  : 'Resend code'}
          </button>

          <button
            type='button'
            onClick={() => {
              setSentTo(null);
              setCooldown(0);
              setExpiresIn(0);
              form.reset();
              resetForm.reset();
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
                Sending code…
              </>
            ) : (
              'Send code'
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

export default ForgotPasswordForm;
