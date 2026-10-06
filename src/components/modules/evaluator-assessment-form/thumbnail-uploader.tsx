'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useUploadAssessmentThumbnail } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';
import { THUMBNAIL_ACCEPTED_TYPES, THUMBNAIL_MAX_SIZE } from '@/validation/assessment.validation';

type ThumbnailUploaderProps = {
  // Key returned by presign, '' when no thumbnail is set.
  value: string;
  onChange: (key: string) => void;
  // Already-saved image (edit mode). The API can replace it but not remove it.
  currentUrl?: string | null;
  disabled?: boolean;
};

// Uploads right after picking: the presigned URL is short-lived, so don't hold it until submit.
const ThumbnailUploader = ({ value, onChange, currentUrl, disabled }: ThumbnailUploaderProps) => {
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

  const hasUpload = Boolean(value && previewUrl);
  const shownUrl = hasUpload ? previewUrl : (currentUrl ?? null);

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
        className='group relative flex aspect-video w-full max-w-md items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted/30 text-sm text-muted-foreground transition-colors hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-60'
      >
        {shownUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- presigned/remote URLs, no configured image domains */}
            <img src={shownUrl} alt='Thumbnail preview' className='size-full object-cover' />
            <span className='absolute inset-x-0 bottom-0 bg-background/80 py-1.5 text-xs font-medium text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
              Click to replace
            </span>
            {hasUpload && currentUrl && (
              <span className='absolute top-2 left-2 rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground'>
                New · saved on submit
              </span>
            )}
          </>
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
        {hasUpload && (
          <Button
            type='button'
            variant='ghost'
            className={currentUrl ? undefined : 'text-destructive hover:text-destructive'}
            disabled={disabled || isPending}
            onClick={() => {
              setPreviewUrl(null);
              onChange('');
            }}
          >
            {currentUrl ? <RotateCcw /> : <Trash2 />}
            {currentUrl ? 'Keep current image' : 'Remove'}
          </Button>
        )}
        <p className='text-xs text-muted-foreground'>
          16:9 works best · JPG, PNG or WebP · max 2 MB
          {currentUrl && ' · a saved image can be replaced, not removed'}
        </p>
      </div>
    </div>
  );
};

export default ThumbnailUploader;
