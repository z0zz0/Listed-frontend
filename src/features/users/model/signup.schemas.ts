import { z } from 'zod';

const namePattern = /^\p{L}+(?:-\p{L}+)*$/u;

function isPastDate(value: string) {
  const parsedDate = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const candidateUtc = Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate());

  return candidateUtc < todayUtc;
}

export const startSignupSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'validation.user.required')
    .pipe(z.email('validation.email.invalid')),
});

export type StartSignupFormValues = z.infer<typeof startSignupSchema>;

export const verifySignupEmailSchema = z.object({
  verificationCode: z
    .string()
    .trim()
    .min(1, 'validation.verificationCode.required')
    .length(6, 'validation.verificationCode.length6')
    .regex(/^\d+$/, 'validation.verificationCode.digits'),
});

export type VerifySignupEmailFormValues = z.infer<typeof verifySignupEmailSchema>;

export const saveSignupProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'validation.firstName.required')
    .regex(namePattern, 'validation.firstName.invalid'),
  lastName: z
    .string()
    .trim()
    .min(1, 'validation.lastName.required')
    .regex(namePattern, 'validation.lastName.invalid'),
  dateOfBirth: z
    .string()
    .trim()
    .min(1, 'validation.dateOfBirth.required')
    .pipe(z.iso.date('validation.dateOfBirth.invalid'))
    .refine(isPastDate, 'validation.dateOfBirth.invalid'),
});

export type SaveSignupProfileFormValues = z.infer<typeof saveSignupProfileSchema>;

export const completeSignupSchema = z
  .object({
    password: z
      .string()
      .min(1, 'validation.password.required')
      .min(8, 'validation.password.minLength8'),
    confirmPassword: z.string().min(1, 'validation.confirmPassword.required'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['confirmPassword'],
    message: 'validation.confirmPassword.mismatch',
  });

export type CompleteSignupFormValues = z.infer<typeof completeSignupSchema>;
