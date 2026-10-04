import type { ApiResponse } from '@/types/api.types';
import type { UserRole, UserStatus } from '@/types/admin-dashboard.types';

export type AdminUsersSortBy = 'createdAt' | 'name' | 'email';
export type SortOrder = 'asc' | 'desc';
export type AuthProvider = 'CREDENTIALS' | 'GOOGLE';

export type AdminUsersQuery = {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: AdminUsersSortBy;
  sortOrder?: SortOrder;
};

export type AdminUserCounts = {
  assessments: number;
  purchaseAssessments: number;
  reviews: number;
  attempts: number;
};

export type AdminUserRow = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
  profession: string | null;
  company: string | null;
  avatarUrl: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count: AdminUserCounts;
};

export type AdminUserDetail = Omit<AdminUserRow, 'profession' | 'company'> & {
  bio: string | null;
  profession: string | null;
  company: string | null;
  experience: number;
  skills: string[];
  auths: { id: string; provider: AuthProvider; createdAt: string }[];
};

export type AdminUsersResponse = ApiResponse<AdminUserRow[]>;

// `DELETED` is rejected by the API; admins cannot delete users here.
export type AdminSettableStatus = Exclude<UserStatus, 'DELETED'>;
