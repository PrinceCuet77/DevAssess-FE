import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { QuestionValues } from '@/validation/assessment.validation';

type AssessmentSummaryProps = {
  questions: QuestionValues[];
  passingPercentage: number;
  duration: number;
  price: number;
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className='flex items-center justify-between gap-4 text-sm'>
    <dt className='text-muted-foreground'>{label}</dt>
    <dd className='font-medium'>{value}</dd>
  </div>
);

// Live numbers so the evaluator can sanity-check marks vs. the passing threshold while building.
const AssessmentSummary = ({ questions, passingPercentage, duration, price }: AssessmentSummaryProps) => {
  const totalMarks = questions.reduce((sum, q) => sum + (Number.isFinite(q.marks) ? q.marks : 0), 0);
  const validPercentage = Number.isFinite(passingPercentage) ? passingPercentage : 0;
  const marksToPass = Math.ceil((totalMarks * validPercentage) / 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>Updates as you build.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className='flex flex-col gap-3'>
          <Row label='Questions' value={String(questions.length)} />
          <Row label='Total marks' value={String(totalMarks)} />
          <Row label='Marks to pass' value={validPercentage ? `${marksToPass} (${validPercentage}%)` : '—'} />
          <Row label='Duration' value={Number.isFinite(duration) && duration > 0 ? `${duration} min` : '—'} />
          <Row label='Price' value={!Number.isFinite(price) ? '—' : price === 0 ? 'Free' : `৳${price}`} />
        </dl>
      </CardContent>
    </Card>
  );
};

export default AssessmentSummary;
