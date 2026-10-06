import type { AssessmentFormValues } from '@/validation/assessment.validation';
import type {
  CreateAssessmentPayload,
  EvaluatorAssessmentDetail,
  UpdateAssessmentPayload,
} from '@/types/evaluator-assessments.types';

// Option ids follow their position (a, b, c…) so the letter shown is also the id the backend gets.
export const optionIdAt = (index: number) => String.fromCharCode(97 + index);

const toQuestionsPayload = (questions: AssessmentFormValues['questions']) =>
  questions.map(({ id, question, marks, options }) => ({
    id,
    question,
    marks,
    options: options.map(({ id: optionId, text }) => ({ id: optionId, text })),
  }));

// The API wants the answer key as a separate array of option ids.
const toAnswerPayload = (questions: AssessmentFormValues['questions']) =>
  questions.map((q) => ({ questionId: q.id, answer: q.correctOptionId }));

export const toCreatePayload = (values: AssessmentFormValues): CreateAssessmentPayload => ({
  title: values.title,
  ...(values.description && { description: values.description }),
  duration: values.duration,
  price: values.price,
  passingPercentage: values.passingPercentage,
  ...(values.thumbnailKey && { thumbnailKey: values.thumbnailKey }),
  ...(values.tags.length > 0 && { tags: values.tags }),
  questions: toQuestionsPayload(values.questions),
  answer: toAnswerPayload(values.questions),
});

// Prefill for the edit form. The answer key comes back as `answers` (plural) and is folded into each question.
export const toFormValues = (assessment: EvaluatorAssessmentDetail): AssessmentFormValues => {
  const answers = new Map(assessment.answers.map((key) => [key.questionId, key.answer]));
  return {
    title: assessment.title,
    description: assessment.description ?? '',
    tags: assessment.tags,
    price: Number(assessment.price),
    duration: assessment.duration,
    passingPercentage: assessment.passingPercentage,
    // Stays empty unless a new image is uploaded; the current one is shown from `thumbnailUrl`.
    thumbnailKey: '',
    questions: assessment.questions.map((q) => {
      // The builder letters options by position; remap in case stored ids were made elsewhere.
      const options = q.options.map((o, i) => ({ id: optionIdAt(i), text: o.text }));
      const correctIndex = q.options.findIndex((o) => o.id === answers.get(q.id));
      return {
        id: q.id,
        question: q.question,
        marks: q.marks,
        options,
        correctOptionId: correctIndex === -1 ? '' : options[correctIndex].id,
      };
    }),
  };
};

const sameArray = (a: unknown[], b: unknown[]) => JSON.stringify(a) === JSON.stringify(b);

// PATCH body with only the fields that changed since the form was loaded.
export const toUpdatePayload = (
  initial: AssessmentFormValues,
  values: AssessmentFormValues,
): UpdateAssessmentPayload => {
  const questions = toQuestionsPayload(values.questions);
  const answer = toAnswerPayload(values.questions);
  const contentChanged =
    !sameArray(toQuestionsPayload(initial.questions), questions) ||
    !sameArray(toAnswerPayload(initial.questions), answer);
  // Whole-array replace, and the API requires both together.
  const content = contentChanged ? { questions, answer } : {};

  return {
    ...content,
    ...(values.title !== initial.title && { title: values.title }),
    // The API rejects empty strings, so a description can be changed but not cleared (the form blocks that).
    ...(values.description && values.description !== initial.description && { description: values.description }),
    ...(!sameArray(values.tags, initial.tags) && { tags: values.tags }),
    ...(values.price !== initial.price && { price: values.price }),
    ...(values.duration !== initial.duration && { duration: values.duration }),
    ...(values.passingPercentage !== initial.passingPercentage && { passingPercentage: values.passingPercentage }),
    ...(values.thumbnailKey && { thumbnailKey: values.thumbnailKey }),
  };
};

export const hasUpdates = (payload: UpdateAssessmentPayload) => Object.keys(payload).length > 0;
