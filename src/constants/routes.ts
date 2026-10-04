import {
  BookOpenCheck,
  ClipboardList,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  PackageCheck,
  PlusCircle,
  ReceiptText,
  ShoppingBag,
  Star,
  Store,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '@/types/user.types';

export const LOGIN_PATH = '/login';

export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  DEVELOPER: '/developer',
  EVALUATOR: '/evaluator',
  ADMIN: '/admin',
};

export interface INavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const ROLE_NAV_ITEMS: Record<Role, INavItem[]> = {
  DEVELOPER: [
    { title: 'Dashboard', href: '/developer', icon: LayoutDashboard },
    { title: 'Browse assessments', href: '/developer/assessments', icon: Store },
    { title: 'My assessments', href: '/developer/my-assessments', icon: BookOpenCheck },
    { title: 'Purchases', href: '/developer/purchases', icon: ShoppingBag },
    { title: 'Payments', href: '/developer/payments', icon: CreditCard },
    { title: 'Reviews', href: '/developer/reviews', icon: Star },
  ],
  EVALUATOR: [
    { title: 'Dashboard', href: '/evaluator', icon: LayoutDashboard },
    { title: 'Assessments', href: '/evaluator/assessments', icon: ClipboardList },
    { title: 'New assessment', href: '/evaluator/assessments/new', icon: PlusCircle },
    { title: 'Sales', href: '/evaluator/purchases', icon: ReceiptText },
  ],
  ADMIN: [
    { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Assessments', href: '/admin/assessments', icon: ClipboardList },
    { title: 'Purchases', href: '/admin/purchases', icon: PackageCheck },
  ],
};

export const USER_NAV_ITEMS: INavItem[] = [
  { title: 'Update profile', href: '/profile', icon: UserRound },
  { title: 'Change password', href: '/change-password', icon: KeyRound },
];
