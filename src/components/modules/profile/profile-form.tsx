'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useForm } from '@tanstack/react-form';
import { Loader2, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FieldError from '@/components/form/field-error';
import AvatarUploader from '@/components/modules/profile/avatar-uploader';
import SkillsInput from '@/components/modules/profile/skills-input';
import { useUpdateProfile } from '@/hooks';
import { getApiErrorMessage, parseFieldErrors } from '@/lib/errors';
import { MAX_BIO_LENGTH, updateProfileSchema } from '@/validation/user.validation';
import type { UpdateProfilePayload, User, UserStatus } from '@/types/user.types';

const STATUS_BADGE: Record<UserStatus, { label: string; variant: 'success' | 'warning' | 'destructive' }> = {
  VERIFIED: { label: 'Verified', variant: 'success' },
  NOT_VERIFIED: { label: 'Not verified', variant: 'warning' },
  SUSPENDED: { label: 'Suspended', variant: 'destructive' },
  DELETED: { label: 'Deleted', variant: 'destructive' },
};

const ProfileForm = ({ user }: { user: User }) => {
  const displayName = user.name ?? user.email.split('@')[0];

  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const { mutateAsync: updateProfile } = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      name: user.name ?? '',
      profession: user.profession ?? '',
      company: user.company ?? '',
      experience: user.experience,
      bio: user.bio ?? '',
      skills: user.skills,
    },
    validators: { onChange: updateProfileSchema },
    onSubmit: async ({ value }) => {
      const parsed = updateProfileSchema.parse(value);
      const initial = {
        name: user.name ?? '',
        profession: user.profession ?? '',
        company: user.company ?? '',
        experience: user.experience,
        bio: user.bio ?? '',
        skills: user.skills,
      };
      // Only send what changed; skills replace the whole array so compare by content.
      const payload: UpdateProfilePayload = {};
      for (const key of Object.keys(parsed) as (keyof typeof parsed)[]) {
        if (JSON.stringify(parsed[key]) !== JSON.stringify(initial[key])) {
          Object.assign(payload, { [key]: parsed[key] });
        }
      }
      setServerErrors({});
      if (Object.keys(payload).length === 0) return;

      try {
        const response = await updateProfile(payload);
        const saved = response.data;
        form.reset({
          name: saved.name ?? '',
          profession: saved.profession ?? '',
          company: saved.company ?? '',
          experience: saved.experience,
          bio: saved.bio ?? '',
          skills: saved.skills,
        });
        toast.success('Profile updated.');
      } catch (error) {
        const fieldErrors = parseFieldErrors(error);
        const names = Object.keys(fieldErrors);
        if (names.length) {
          setServerErrors(fieldErrors);
        } else {
          toast.error(getApiErrorMessage(error, 'Could not update profile. Please try again.'));
        }
      }
    },
  });

  // Warn before closing/reloading the tab with unsaved changes.
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (form.state.isDirty) event.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [form]);

  const status = STATUS_BADGE[user.status];

  return (
    <form
      className='flex flex-col gap-6'
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Profile photo</CardTitle>
          <CardDescription>Shown on your account and across the marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
          <AvatarUploader name={displayName} avatarUrl={user.avatarUrl} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>These details are managed by the platform.</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='email'>Email</Label>
            <div className='relative'>
              <Lock className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input id='email' value={user.email} disabled readOnly className='h-11 pl-8' />
            </div>
            <p className='text-xs text-muted-foreground'>Your email can&apos;t be changed.</p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='default' className='capitalize'>
              {user.role.toLowerCase()}
            </Badge>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal details</CardTitle>
          <CardDescription>Tell others a bit about yourself.</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-5 sm:grid-cols-2'>
          <form.Field name='name'>
            {(field) => (
              <div className='flex flex-col gap-1.5 sm:col-span-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  className='h-11'
                  autoComplete='name'
                  placeholder='Jane Doe'
                  value={field.state.value}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldError errors={[...(field.state.meta.isTouched ? field.state.meta.errors : []), serverErrors[field.name]]} />
              </div>
            )}
          </form.Field>

          <form.Field name='profession'>
            {(field) => (
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='profession'>Profession</Label>
                <Input
                  id='profession'
                  className='h-11'
                  placeholder='Software Engineer'
                  value={field.state.value}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldError errors={[...(field.state.meta.isTouched ? field.state.meta.errors : []), serverErrors[field.name]]} />
              </div>
            )}
          </form.Field>

          <form.Field name='company'>
            {(field) => (
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='company'>Company</Label>
                <Input
                  id='company'
                  className='h-11'
                  autoComplete='organization'
                  placeholder='Acme'
                  value={field.state.value}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldError errors={[...(field.state.meta.isTouched ? field.state.meta.errors : []), serverErrors[field.name]]} />
              </div>
            )}
          </form.Field>

          <form.Field name='experience'>
            {(field) => (
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='experience'>Years of experience</Label>
                <Input
                  id='experience'
                  type='number'
                  min={0}
                  max={80}
                  step={1}
                  inputMode='numeric'
                  className='h-11'
                  value={Number.isNaN(field.state.value) ? '' : field.state.value}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.valueAsNumber)}
                />
                <FieldError errors={[...(field.state.meta.isTouched ? field.state.meta.errors : []), serverErrors[field.name]]} />
              </div>
            )}
          </form.Field>

          <form.Field name='bio'>
            {(field) => (
              <div className='flex flex-col gap-1.5 sm:col-span-2'>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea
                  id='bio'
                  rows={4}
                  placeholder='Full-stack developer who loves clean APIs.'
                  value={field.state.value}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <div className='flex items-start justify-between gap-2'>
                  <div><FieldError errors={[...(field.state.meta.isTouched ? field.state.meta.errors : []), serverErrors[field.name]]} /></div>
                  <p className='text-xs text-muted-foreground' aria-live='polite'>
                    {field.state.value.length}/{MAX_BIO_LENGTH}
                  </p>
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name='skills'>
            {(field) => (
              <div className='flex flex-col gap-1.5 sm:col-span-2'>
                <Label htmlFor='skills'>Skills</Label>
                <SkillsInput id='skills' value={field.state.value} onChange={field.handleChange} />
                <FieldError errors={[...(field.state.meta.isTouched ? field.state.meta.errors : []), serverErrors[field.name]]} />
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isDirty, state.isSubmitting] as const}>
        {([canSubmit, isDirty, isSubmitting]) => (
          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' size='lg' disabled={!isDirty} onClick={() => form.reset()}>
              Discard
            </Button>
            <Button type='submit' size='lg' disabled={!canSubmit || !isDirty || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='animate-spin' />
                  Saving…
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
};

export default ProfileForm;
