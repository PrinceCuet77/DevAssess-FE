'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import FieldError from '@/components/form/field-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SITE } from '@/constants/site';
import { useGetMyProfile } from '@/hooks';
import { CONTACT_TOPICS, MAX_MESSAGE_LENGTH, contactSchema } from '@/validation/contact.validation';

const SELECT_CLASS =
  'h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 disabled:opacity-50 dark:bg-input/30 dark:[&>option]:bg-background';

// There is no contact endpoint on the backend, so a valid message is handed to the visitor's
// email client, addressed to support with everything pre-filled.
const ContactForm = () => {
  const { data: user } = useGetMyProfile();
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null);
  const [isSending, setIsSending] = useState(false);

  const form = useForm({
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '', topic: 'general', message: '' },
    validators: { onChange: contactSchema, onSubmit: contactSchema },
    onSubmit: ({ value }) => {
      setIsSending(true);
      const topic = CONTACT_TOPICS.find((t) => t.value === value.topic)?.label ?? 'General question';
      const subject = `[${topic}] Message from ${value.name.trim()}`;
      const body = `${value.message.trim()}\n\n—\n${value.name.trim()}\n${value.email.trim()}`;
      try {
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent({ name: value.name.trim(), email: value.email.trim() });
        toast.success('Your message is ready to send in your email app.');
      } catch {
        toast.error(`We couldn't open your email app. Please write to ${SITE.email}.`);
      } finally {
        setIsSending(false);
      }
    },
  });

  if (sent) {
    return (
      <div role='status' className='flex flex-col items-center gap-4 py-8 text-center'>
        <span className='flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
          <CheckCircle2 className='size-7' aria-hidden />
        </span>
        <div className='flex flex-col gap-1.5'>
          <h3 className='font-heading text-lg font-semibold'>Thanks, {sent.name}!</h3>
          <p className='max-w-sm text-sm text-muted-foreground'>
            Your email app should have opened with your message addressed to{' '}
            <a href={`mailto:${SITE.email}`} className='font-medium text-primary hover:underline'>
              {SITE.email}
            </a>
            . Hit send there and we&apos;ll reply to {sent.email} within one business day.
          </p>
        </div>
        <Button
          variant='outline'
          onClick={() => {
            setSent(null);
            form.reset();
          }}
        >
          Write another message
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className='flex flex-col gap-5'
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className='grid gap-5 sm:grid-cols-2'>
        <form.Field name='name'>
          {(field) => (
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='contact-name'>
                Full name <span className='text-destructive' aria-hidden>*</span>
              </Label>
              <Input
                id='contact-name'
                name={field.name}
                autoComplete='name'
                required
                placeholder='Your name'
                value={field.state.value}
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSending}
                className='h-11'
              />
              {field.state.meta.isTouched && <FieldError errors={field.state.meta.errors} />}
            </div>
          )}
        </form.Field>

        <form.Field name='email'>
          {(field) => (
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='contact-email'>
                Email <span className='text-destructive' aria-hidden>*</span>
              </Label>
              <Input
                id='contact-email'
                name={field.name}
                type='email'
                autoComplete='email'
                required
                placeholder='you@example.com'
                value={field.state.value}
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSending}
                className='h-11'
              />
              {field.state.meta.isTouched && <FieldError errors={field.state.meta.errors} />}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name='topic'>
        {(field) => (
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='contact-topic'>Topic</Label>
            <select
              id='contact-topic'
              name={field.name}
              className={SELECT_CLASS}
              value={field.state.value}
              aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={isSending}
            >
              {CONTACT_TOPICS.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
            {field.state.meta.isTouched && <FieldError errors={field.state.meta.errors} />}
          </div>
        )}
      </form.Field>

      <form.Field name='message'>
        {(field) => (
          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='contact-message'>
                Message <span className='text-destructive' aria-hidden>*</span>
              </Label>
              <span className='text-xs text-muted-foreground tabular-nums' aria-live='polite'>
                {field.state.value.length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <Textarea
              id='contact-message'
              name={field.name}
              required
              rows={6}
              placeholder='How can we help? Include an order or assessment name if it relates to one.'
              value={field.state.value}
              aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={isSending}
            />
            {field.state.meta.isTouched && <FieldError errors={field.state.meta.errors} />}
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type='submit' size='lg' className='h-11 w-full text-base sm:w-auto sm:self-start sm:px-6' disabled={isSubmitting || isSending}>
            {isSubmitting || isSending ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Preparing…
              </>
            ) : (
              <>
                <Send className='size-4' />
                Send message
              </>
            )}
          </Button>
        )}
      </form.Subscribe>
      <p className='text-xs text-muted-foreground'>
        Sending opens your email app with the message ready to go. Prefer to write directly? Email{' '}
        <a href={`mailto:${SITE.email}`} className='font-medium text-primary hover:underline'>
          {SITE.email}
        </a>
        .
      </p>
    </form>
  );
};

export default ContactForm;
