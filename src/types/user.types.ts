export type Role = 'DEVELOPER' | 'EVALUATOR' | 'ADMIN';

export type UserStatus = 'NOT_VERIFIED' | 'VERIFIED' | 'DELETED' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  name: string | null;
  bio: string | null;
  profession: string | null;
  company: string | null;
  experience: number;
  skills: string[];
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface changePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
