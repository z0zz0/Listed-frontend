import type {
  AccessTokenResponseDto,
  GetAuthSessionResponseDto,
} from '@/features/auth/model/auth.dto';
import type { AuthSession } from '@/features/auth/model/auth.types';

export interface AccessTokenPayload {
  accessToken: string;
  expiresAtUtc?: string;
  expiresInSeconds?: number;
}

function requireNonEmptyString(value: unknown, errorMessage: string) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(errorMessage);
  }

  return value;
}

export function mapAccessTokenResponse(dto: AccessTokenResponseDto): AccessTokenPayload {
  const accessToken = requireNonEmptyString(dto.token, 'Login response did not include an access token.');

  return {
    accessToken,
    expiresAtUtc: dto.expiresAtUtc,
    expiresInSeconds: dto.expiresInSeconds,
  };
}

export function mapGetAuthSessionResponse(dto: GetAuthSessionResponseDto): AuthSession {
  const userId = requireNonEmptyString(dto.userId, 'Session response did not include userId.');
  const email = requireNonEmptyString(dto.email, 'Session response did not include email.');

  return {
    userId,
    email,
  };
}
