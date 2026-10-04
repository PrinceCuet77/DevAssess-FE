'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AVATAR_ACCEPTED_TYPES, AVATAR_MAX_SIZE } from '@/validation/user.validation';

interface AvatarUploaderProps {
  name: string;
  avatarUrl: string | null;
}

const getInitials = (value: string) => value.trim().slice(0, 2).toUpperCase() || '?';

const AvatarUploader = ({ name, avatarUrl }: AvatarUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const currentSrc = preview ?? (removed ? null : avatarUrl);

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
    setPreview(URL.createObjectURL(file));
    setRemoved(false);
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
          <Button type='button' variant='outline' onClick={() => inputRef.current?.click()}>
            <Camera />
            Change photo
          </Button>
          {currentSrc && (
            <Button
              type='button'
              variant='ghost'
              className='text-destructive hover:text-destructive'
              onClick={() => {
                setPreview(null);
                setRemoved(true);
              }}
            >
              <Trash2 />
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
