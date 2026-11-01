import { z } from 'zod';

export const name = z
  .string()
  .trim()
  .min(2, 'Enter your full name')
  .max(80, 'Use 80 characters or fewer')

export const email = z
  .string()
  .trim()
  .min(1, 'Enter your email address')
  .email('Enter a valid email address');

export const password = z
  .string()
  .min(1, 'Enter your password');

export const newPassword = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(128, 'Use 128 characters or fewer')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/\d/, 'Include at least one number');

export const confirmPassword = z
  .string()
  .min(1, 'Re-enter your password');

