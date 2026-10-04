import { Construction } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface IProps {
  title: string;
  description: string;
  api?: string;
  resourceId?: string;
}

export default function PlaceholderPage({ title, description, api, resourceId }: IProps) {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='font-heading text-2xl font-semibold tracking-tight'>{title}</h1>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
      <Card>
        <CardHeader>
          <span className='mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
            <Construction className='size-6' />
          </span>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>This page is a placeholder and will be built out soon.</CardDescription>
        </CardHeader>
        {(resourceId || api) && (
          <CardContent className='space-y-1 text-sm text-muted-foreground'>
            {resourceId && (
              <p>
                Resource ID: <code className='font-mono text-foreground'>{resourceId}</code>
              </p>
            )}
            {api && (
              <p>
                API: <code className='font-mono text-foreground'>{api}</code>
              </p>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
