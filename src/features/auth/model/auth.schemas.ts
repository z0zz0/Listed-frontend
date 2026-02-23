import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'validation.user.required')
    .pipe(z.email('validation.email.invalid')),
  password: z.string().min(1, 'validation.password.required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
