import Link from 'next/link';
import { CalendarCheck, Clock, Eye, Play, Target } from 'lucide-react';
import AssessmentThumbnail from '@/components/modules/evaluator-purchases/assessment-thumbnail';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { OwnedAssessment } from '@/types/developer-assessments.types';

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

const OwnedAssessmentCard = ({ assessment }: { assessment: OwnedAssessment }) => {
  const creator = assessment.creator.name ?? assessment.creator.email.split('@')[0];

  return (
    <Card className='gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md'>
      <AssessmentThumbnail
        src={assessment.thumbnailUrl}
        className='aspect-video h-auto w-full rounded-none ring-0 [&_svg]:size-8'
      />
      <CardContent className='flex flex-1 flex-col gap-4 p-4'>
        <div className='flex flex-col gap-1'>
          <h3 className='line-clamp-1 font-heading text-base font-semibold tracking-tight'>
            {assessment.title}
          </h3>
          <p className='text-xs text-muted-foreground'>by {creator}</p>
          <p className='line-clamp-2 min-h-10 text-sm text-muted-foreground'>
            {assessment.description}
          </p>
        </div>

        <dl className='flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground'>
          <div className='flex items-center gap-1.5'>
            <Clock className='size-3.5' aria-hidden />
            <dt className='sr-only'>Duration</dt>
            <dd>{formatDuration(assessment.duration)}</dd>
          </div>
          <div className='flex items-center gap-1.5'>
            <Target className='size-3.5' aria-hidden />
            <dt className='sr-only'>Pass mark</dt>
            <dd>{assessment.passingPercentage}% to pass</dd>
          </div>
          <div className='flex items-center gap-1.5'>
            <CalendarCheck className='size-3.5' aria-hidden />
            <dt className='sr-only'>Purchased</dt>
            <dd>{new Date(assessment.purchasedAt).toLocaleDateString()}</dd>
          </div>
        </dl>

        <div className='mt-auto flex gap-2'>
          <Button
            className='flex-1'
            nativeButton={false}
            render={<Link href={`/developer/assessments/detail/take?id=${assessment.id}`} />}
          >
            <Play />
            Take assessment
          </Button>
          <Button
            variant='outline'
            size='icon'
            aria-label={`View details for ${assessment.title}`}
            nativeButton={false}
            render={<Link href={`/developer/assessments/detail?id=${assessment.id}`} />}
          >
            <Eye />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnedAssessmentCard;
