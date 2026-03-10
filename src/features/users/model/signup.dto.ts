import type { AccessTokenResponseDto } from '@/features/auth/model/auth.dto';

export interface StartSignupResponseDto {
  signupId?: string;
  email?: string;
  codeExpiresAtUtc?: string;
}

export interface VerifySignupEmailResponseDto {
  signupId?: string;
  verifiedAtUtc?: string;
}

export interface SaveSignupProfileResponseDto {
  signupId?: string;
}

export interface CompleteSignupResponseDto {
  id?: string;
  email?: string;
  accessToken?: AccessTokenResponseDto;
}
