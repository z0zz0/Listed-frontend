import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const getUserByEmailSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
});

export type GetUserByEmailFormValues = z.infer<typeof getUserByEmailSchema>;
