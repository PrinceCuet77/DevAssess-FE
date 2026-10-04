'use client';

import { useRef } from 'react';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRemoveAvatar, useUploadAvatar } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';
import { AVATAR_ACCEPTED_TYPES, AVATAR_MAX_SIZE } from '@/validation/user.validation';

interface AvatarUploaderProps {
  name: string;
  avatarUrl: string | null;
}

const getInitials = (value: string) => value.trim().slice(0, 2).toUpperCase() || '?';

const AvatarUploader = ({ name, avatarUrl }: AvatarUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending: uploading } = useUploadAvatar();
  const { mutate: remove, isPending: removing } = useRemoveAvatar();
  const busy = uploading || removing;
  const currentSrc = avatarUrl;

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!AVATAR_ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please choose a JPG, PNG or WebP image.');
      return;
    }
    if (file.size > AVATAR_MAX_SIZE) {
      toast.error('Image must be 5 MB or smaller.');
      return;
    }
    upload(file, {
      onSuccess: () => toast.success('Profile photo updated.'),
      onError: (error) => toast.error(getApiErrorMessage(error, 'Could not upload photo. Please try again.')),
    });
  };

  return (
    <div className='flex flex-col items-center gap-4 sm:flex-row'>
      <Avatar className='size-24 text-2xl'>
        {currentSrc && <AvatarImage src={currentSrc} alt={name} />}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col items-center gap-2 sm:items-start'>
        <div className='flex gap-2'>
          <input
            ref={inputRef}
            type='file'
            accept={AVATAR_ACCEPTED_TYPES.join(',')}
            className='sr-only'
            tabIndex={-1}
            onChange={(event) => {
              handleFile(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
          <Button type='button' variant='outline' disabled={busy} onClick={() => inputRef.current?.click()}>
            {uploading ? <Loader2 className='animate-spin' /> : <Camera />}
            Change photo
          </Button>
          {currentSrc && (
            <Button
              type='button'
              variant='ghost'
              className='text-destructive hover:text-destructive'
              disabled={busy}
              onClick={() =>
                remove(undefined, {
                  onSuccess: () => toast.success('Profile photo removed.'),
                  onError: (error) => toast.error(getApiErrorMessage(error, 'Could not remove photo.')),
                })
              }
            >
              {removing ? <Loader2 className='animate-spin' /> : <Trash2 />}
              Remove
            </Button>
          )}
        </div>
        <p className='text-xs text-muted-foreground'>JPG, PNG or WebP. Max 5 MB.</p>
      </div>
    </div>
  );
};

export default AvatarUploader;
