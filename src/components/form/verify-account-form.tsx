'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, MailCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { OTP_LENGTH, verifyAccountSchema } from '@/validation/auth.validation';
import { useResendVerificationOtp, useVerifyAccount } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';
import { LOGIN_PATH } from '@/constants/routes';

// The OTP lives for 2 minutes; a new one can only be requested once it has expired.
const OTP_EXPIRY_SECONDS = 2 * 60;

const FALLBACK_ERROR = 'Something went wrong. Please try again.';

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const VerifyAccountForm = ({ email }: { email: string }) => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);

  const { mutate: verify, isPending: isVerifying } = useVerifyAccount();
  const { mutate: resend, isPending: isResending } = useResendVerificationOtp();

  const canResend = secondsLeft <= 0;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleVerify = (code: string) => {
    if (!verifyAccountSchema.safeParse({ otp: code }).success || isVerifying) return;

    verify(
      { email, otp: code },
      {
        onSuccess: () => {
          toast.success('Account verified. Please sign in.');
          router.push(LOGIN_PATH);
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, FALLBACK_ERROR));
          setOtp('');
        },
      },
    );
  };

  const handleResend = () => {
    if (!canResend) return;

    resend(
      { email },
      {
        onSuccess: () => {
          toast.success('A new code has been sent.');
          setOtp('');
          setSecondsLeft(OTP_EXPIRY_SECONDS);
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, FALLBACK_ERROR));
        },
      },
    );
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col items-center gap-3 text-center'>
        <span className='flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <MailCheck className='size-6' />
        </span>
        <div className='space-y-1.5'>
          <h1 className='font-heading text-2xl font-semibold tracking-tight'>Verify your account</h1>
          <p className='text-sm text-muted-foreground'>
            We&apos;ve sent a {OTP_LENGTH}-digit code to{' '}
            <span className='font-medium text-foreground'>{email}</span>.
          </p>
        </div>
      </div>

      <form
        className='flex flex-col items-center gap-5'
        onSubmit={(event) => {
          event.preventDefault();
          handleVerify(otp);
        }}
      >
        <InputOTP
          maxLength={OTP_LENGTH}
          value={otp}
          onChange={setOtp}
          disabled={isVerifying}
          autoFocus
          inputMode='numeric'
          pattern='^[0-9]*$'
          autoComplete='one-time-code'
        >
          <InputOTPGroup>
            {Array.from({ length: OTP_LENGTH }, (_, index) => (
              <InputOTPSlot key={index} index={index} className='size-11 text-base' />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <Button
          type='submit'
          size='lg'
          className='h-11 w-full text-base'
          disabled={otp.length !== OTP_LENGTH || isVerifying}
        >
          {isVerifying ? (
            <>
              <Loader2 className='size-4 animate-spin' />
              Verifying…
            </>
          ) : (
            'Verify account'
          )}
        </Button>
      </form>

      <div className='flex flex-col items-center gap-3 text-center'>
        <button
          type='button'
          className='text-sm font-medium text-primary hover:underline disabled:pointer-events-none disabled:text-muted-foreground'
          disabled={!canResend || isResending}
          onClick={handleResend}
        >
          {isResending
            ? 'Resending…'
            : canResend
              ? 'Resend code'
              : `Resend code in ${formatTime(secondsLeft)}`}
        </button>

        <Link href='/register' className='text-xs font-medium text-muted-foreground hover:text-foreground hover:underline'>
          Use a different email
        </Link>
      </div>
    </div>
  );
};

export default VerifyAccountForm;
