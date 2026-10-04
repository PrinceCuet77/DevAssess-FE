'use client';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useTestLogin } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';
import type { Role } from '@/types/user.types';

const TEST_LOGINS: { role: Role; label: string }[] = [
  { role: 'DEVELOPER', label: 'Test Developer login' },
  { role: 'EVALUATOR', label: 'Test Evaluator login' },
  { role: 'ADMIN', label: 'Test Admin login' },
];

const TestLoginButtons = () => {
  const { mutate: testLogin, isPending, variables } = useTestLogin();

  const handleClick = (role: Role) => {
    testLogin(role, {
      onSuccess: () => toast.success('Login successful!'),
      onError: (error) =>
        toast.error(getApiErrorMessage(error, 'Test login failed. Please try again.')),
    });
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='relative flex items-center py-1'>
        <span className='h-px flex-1 bg-border' />
        <span className='px-3 text-xs text-muted-foreground'>TEST ACCOUNTS</span>
        <span className='h-px flex-1 bg-border' />
      </div>
      {TEST_LOGINS.map(({ role, label }) => (
        <Button
          key={role}
          type='button'
          variant='secondary'
          size='lg'
          className='h-10 w-full'
          disabled={isPending}
          onClick={() => handleClick(role)}
        >
          {isPending && variables === role && <Loader2 className='size-4 animate-spin' />}
          {label}
        </Button>
      ))}
    </div>
  );
};

export default TestLoginButtons;
