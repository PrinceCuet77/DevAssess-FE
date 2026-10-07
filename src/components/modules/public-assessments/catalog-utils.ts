import type { AssessmentPerson, CatalogReview } from '@/types/assessment.types';

export const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });

const RELATIVE_STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
];

export const formatRelative = (iso: string) => {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return 'just now';
};

export const averageRating = (reviews: CatalogReview[]) =>
  reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

export const creatorName = (creator: AssessmentPerson) => creator.name ?? creator.email.split('@')[0];

// Reviewer emails come back from the API; never show them publicly.
export const reviewerName = (developer: AssessmentPerson) => developer.name ?? 'Anonymous developer';

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

// Assessments without a thumbnail still get a distinct, stable cover.
const COVERS = [
  'from-violet-500/40 via-fuchsia-500/25 to-sky-500/40',
  'from-sky-500/40 via-cyan-500/25 to-emerald-500/40',
  'from-amber-500/40 via-orange-500/25 to-rose-500/40',
  'from-emerald-500/40 via-teal-500/25 to-sky-500/40',
  'from-rose-500/40 via-pink-500/25 to-violet-500/40',
  'from-indigo-500/40 via-blue-500/25 to-cyan-500/40',
];

export const coverGradient = (id: string) => {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return COVERS[Math.abs(hash) % COVERS.length];
};
