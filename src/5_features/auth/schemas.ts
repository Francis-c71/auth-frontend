import { z } from 'zod';

// Client-side validation is for fast feedback only. 
// Keep these rules in step with your backend, 
// which must enforce them independently.

const email = z
  .string()
  .trim()
  .min(1, 'Enter your email address')
  .email('Enter a valid email address');

const newPassword = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(128, 'Use 128 characters or fewer')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/\d/, 'Include at least one number');

const confirmPassword = z
  .string()
  .min(1, 'Re-enter your password');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Enter your full name')
      .max(80, 'Use 80 characters or fewer'),
    email,
    password: newPassword,
    confirmPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords don’t match',
  });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ password: newPassword, confirmPassword })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords don’t match',
  });

// Infered From Value Types
// These types are auto-generated from Zod schemas

// Don't edit these types manually; 
// they will be overwritten when the schemas change.

// Use them as props for React Hook Form / API payloads 
// to ensure type safety and consistency across the application.

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
