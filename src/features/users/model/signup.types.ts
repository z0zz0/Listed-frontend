export const signupSteps = {
  start: 'start',
  verifyCode: 'verifyCode',
  personalInfo: 'personalInfo',
  complete: 'complete',
} as const;

export type SignupStep = (typeof signupSteps)[keyof typeof signupSteps];
