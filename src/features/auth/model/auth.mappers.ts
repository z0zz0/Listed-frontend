import type { AccessTokenResponseDto, GetMeResponseDto } from '@/features/auth/model/auth.dto';
import type { AuthSession } from '@/features/auth/model/auth.types';

export interface AccessTokenPayload {
  accessToken: string;
  expiresAtUtc?: string;
  expiresInSeconds?: number;
}

export function mapAccessTokenResponse(dto: AccessTokenResponseDto): AccessTokenPayload {
  const accessToken = dto.token;

  if (typeof accessToken !== 'string' || accessToken.trim().length === 0) {
    throw new Error('Login response did not include an access token.');
  }

  return {
    accessToken,
    expiresAtUtc: dto.expiresAtUtc,
    expiresInSeconds: dto.expiresInSeconds,
  };
}

export function mapGetMeResponse(dto: GetMeResponseDto): AuthSession {
  const userId = dto.userId;
  const email = dto.email;

  if (typeof userId !== 'string' || userId.trim().length === 0) {
    throw new Error('Session response did not include userId.');
  }

  if (typeof email !== 'string' || email.trim().length === 0) {
    throw new Error('Session response did not include email.');
  }

  return {
    userId,
    email,
  };
}
