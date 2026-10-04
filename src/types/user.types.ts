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

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  profession?: string;
  company?: string;
  experience?: number;
  skills?: string[];
}

export interface AvatarPresign {
  uploadUrl: string;
  key: string;
  avatarUrl: string;
  expiresInSeconds: number;
}
