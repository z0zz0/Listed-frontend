import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().trim().pipe(z.email('validation.email.invalid')),
  password: z.string().min(8, 'validation.password.minLength8'),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const getUserByEmailSchema = z.object({
  email: z.string().trim().pipe(z.email('validation.email.invalid')),
});

export type GetUserByEmailFormValues = z.infer<typeof getUserByEmailSchema>;
