import RoleGuard from '@/components/auth/role-guard';

export default function EvaluatorLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard roles={['EVALUATOR']}>{children}</RoleGuard>;
}
