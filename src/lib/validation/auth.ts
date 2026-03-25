import { z } from 'zod';

// Shared validations
const emailSchema = z.string().email('Please enter a valid email address.');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long.');

export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'), // We don't enforce min length strictly on login to prevent leaking info
});

export type SignInInput = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
