import { mapAccessTokenResponse, type AccessTokenPayload } from '@/features/auth/model/auth.mappers';
import type {
  CompleteSignupResponseDto,
  SaveSignupProfileResponseDto,
  StartSignupResponseDto,
  VerifySignupEmailResponseDto,
} from '@/features/users/model/signup.dto';

export interface StartSignupPayload {
  signupId: string;
  email: string;
  codeExpiresAtUtc: string;
}

export interface VerifySignupEmailPayload {
  signupId: string;
  verifiedAtUtc: string;
}

export interface SaveSignupProfilePayload {
  signupId: string;
}

export interface CompleteSignupPayload {
  id: string;
  email: string;
  accessToken: AccessTokenPayload;
}

function requireNonEmptyString(value: unknown, errorMessage: string) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(errorMessage);
  }

  return value;
}

export function mapStartSignupResponse(dto: StartSignupResponseDto): StartSignupPayload {
  return {
    signupId: requireNonEmptyString(dto.signupId, 'Start signup response did not include signupId.'),
    email: requireNonEmptyString(dto.email, 'Start signup response did not include email.'),
    codeExpiresAtUtc: requireNonEmptyString(dto.codeExpiresAtUtc, 'Start signup response did not include codeExpiresAtUtc.'),
  };
}

export function mapVerifySignupEmailResponse(dto: VerifySignupEmailResponseDto): VerifySignupEmailPayload {
  return {
    signupId: requireNonEmptyString(dto.signupId, 'Verify signup response did not include signupId.'),
    verifiedAtUtc: requireNonEmptyString(dto.verifiedAtUtc, 'Verify signup response did not include verifiedAtUtc.'),
  };
}

export function mapSaveSignupProfileResponse(dto: SaveSignupProfileResponseDto): SaveSignupProfilePayload {
  return {
    signupId: requireNonEmptyString(dto.signupId, 'Save signup profile response did not include signupId.'),
  };
}

export function mapCompleteSignupResponse(dto: CompleteSignupResponseDto): CompleteSignupPayload {
  return {
    id: requireNonEmptyString(dto.id, 'Complete signup response did not include id.'),
    email: requireNonEmptyString(dto.email, 'Complete signup response did not include email.'),
    accessToken: mapAccessTokenResponse(dto.accessToken ?? {}),
  };
}
