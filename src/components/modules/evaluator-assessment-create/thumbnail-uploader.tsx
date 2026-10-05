'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useUploadAssessmentThumbnail } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';
import { THUMBNAIL_ACCEPTED_TYPES, THUMBNAIL_MAX_SIZE } from '@/validation/assessment.validation';

type ThumbnailUploaderProps = {
  // Key returned by presign, '' when no thumbnail is set.
  value: string;
  onChange: (key: string) => void;
  disabled?: boolean;
};

// Uploads right after picking: the presigned URL is short-lived, so don't hold it until submit.
const ThumbnailUploader = ({ value, onChange, disabled }: ThumbnailUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { mutate: upload, isPending } = useUploadAssessmentThumbnail();

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!THUMBNAIL_ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please choose a JPG, PNG or WebP image.');
      return;
    }
    if (file.size > THUMBNAIL_MAX_SIZE) {
      toast.error('Image must be 2 MB or smaller.');
      return;
    }
    upload(file, {
      onSuccess: (data) => {
        setPreviewUrl(data.thumbnailUrl);
        onChange(data.key);
      },
      onError: (error) => toast.error(getApiErrorMessage(error, 'Could not upload thumbnail. Please try again.')),
    });
  };

  const hasImage = Boolean(value && previewUrl);

  return (
    <div className='flex flex-col gap-3'>
      <input
        ref={inputRef}
        type='file'
        accept={THUMBNAIL_ACCEPTED_TYPES.join(',')}
        className='sr-only'
        tabIndex={-1}
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      <button
        type='button'
        disabled={disabled || isPending}
        onClick={() => inputRef.current?.click()}
        className='relative flex aspect-video w-full max-w-md items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted/30 text-sm text-muted-foreground transition-colors hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-60'
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl!} alt='Thumbnail preview' className='size-full object-cover' />
        ) : (
          <span className='flex flex-col items-center gap-2'>
            <ImagePlus className='size-8' />
            Click to choose a cover image
          </span>
        )}
        {isPending && (
          <span className='absolute inset-0 flex items-center justify-center bg-background/70'>
            <Loader2 className='size-6 animate-spin' />
          </span>
        )}
      </button>
      <div className='flex items-center gap-3'>
        {hasImage && (
          <Button
            type='button'
            variant='ghost'
            className='text-destructive hover:text-destructive'
            disabled={disabled || isPending}
            onClick={() => {
              setPreviewUrl(null);
              onChange('');
            }}
          >
            <Trash2 />
            Remove
          </Button>
        )}
        <p className='text-xs text-muted-foreground'>16:9 works best · JPG, PNG or WebP · max 2 MB</p>
      </div>
    </div>
  );
};

export default ThumbnailUploader;
