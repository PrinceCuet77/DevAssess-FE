import { Loader2 } from 'lucide-react';

export default function AuthLoading({ label = 'Verifying your account…' }: { label?: string }) {
  return (
    <div
      role='status'
      aria-live='polite'
      className='flex min-h-[calc(100svh-4rem)] flex-1 flex-col items-center justify-center gap-3 px-4 text-sm text-muted-foreground'
    >
      <Loader2 className='size-6 animate-spin text-primary' />
      <p>{label}</p>
    </div>
  );
}
