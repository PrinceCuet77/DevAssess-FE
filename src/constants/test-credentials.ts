import type { loginPayload } from '@/types/auth.types';
import type { Role } from '@/types/user.types';

const TEST_CREDENTIALS: Record<Role, Partial<loginPayload>> = {
  DEVELOPER: {
    email: process.env.NEXT_PUBLIC_TEST_DEVELOPER_EMAIL,
    password: process.env.NEXT_PUBLIC_TEST_DEVELOPER_PASSWORD,
  },
  EVALUATOR: {
    email: process.env.NEXT_PUBLIC_TEST_EVALUATOR_EMAIL,
    password: process.env.NEXT_PUBLIC_TEST_EVALUATOR_PASSWORD,
  },
  ADMIN: {
    email: process.env.NEXT_PUBLIC_TEST_ADMIN_EMAIL,
    password: process.env.NEXT_PUBLIC_TEST_ADMIN_PASSWORD,
  },
};

export const getTestCredentials = (role: Role): loginPayload => {
  const { email, password } = TEST_CREDENTIALS[role];

  if (!email || !password) {
    throw new Error(`Test credentials for ${role} are unavailable.`);
  }

  return { email, password };
};
