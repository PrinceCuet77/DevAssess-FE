'use client';

import { Button } from '@/components/ui/button';
import GoogleIcon from '@/components/form/google-icon';
import { GOOGLE_AUTH_URL } from '@/api';
import { stashOAuthRedirect } from '@/lib/redirect';

const GoogleAuthButton = () => {
  return (
    <Button
      type='button'
      variant='outline'
      size='lg'
      className='h-11 w-full gap-2 text-base'
      // Full-page navigation: the API runs the OAuth flow and sets the auth cookies.
      onClick={() => {
        stashOAuthRedirect();
        window.location.assign(GOOGLE_AUTH_URL);
      }}
    >
      <GoogleIcon className='size-4' />
      Continue with Google
    </Button>
  );
};

export default GoogleAuthButton;
