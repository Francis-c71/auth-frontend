import { z } from 'zod';
import { name, email, password, newPassword, confirmPassword } from '../validators/auth.validator';


export const loginSchema = z.object({
  email,
  password,
});

export const registerSchema = z
  .object({
    name,
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


export type LoginValues = z.infer<typeof loginSchema>;

export type RegisterValues = z.infer<typeof registerSchema>;

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';


export interface RegisterInput { name: string; email: string;  password: string;}

export interface LoginInput { email: string; password: string;}

export interface ResetPasswordInput {token: string; password: string; }
