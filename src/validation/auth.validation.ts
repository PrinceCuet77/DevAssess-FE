import { ROLES } from '@/constants/roles';
import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(ROLES),
});

export const loginUserSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
});

export const OTP_LENGTH = 6;

export const resetPasswordSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(
      new RegExp(`^\\d{${OTP_LENGTH}}$`),
      `Enter the ${OTP_LENGTH}-digit code`,
    ),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const verifyAccountSchema = z.object({
  otp: resetPasswordSchema.shape.otp,
});
