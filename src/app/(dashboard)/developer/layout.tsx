import RoleGuard from '@/components/auth/role-guard';

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard roles={['DEVELOPER']}>{children}</RoleGuard>;
}
