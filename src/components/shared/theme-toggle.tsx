'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/theme.provider';
import { cn } from '@/lib/utils';

const ThemeToggle = ({ className }: { className?: string }) => {
  const { toggleTheme } = useTheme();

  return (
    <Button
      type='button'
      variant='outline'
      size='icon'
      onClick={toggleTheme}
      aria-label='Toggle color theme'
      className={cn('relative overflow-hidden', className)}
    >
      <Sun className='size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      <Moon className='absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
    </Button>
  );
};

export default ThemeToggle;
