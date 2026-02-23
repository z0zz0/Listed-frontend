import type { LoginInput } from '@/features/auth/model/auth.types';
import type { AccessTokenResponseDto } from '@/features/auth/model/auth.dto';
import { apiPaths } from '@/app/router/paths';
import { mapAccessTokenResponse, type AccessTokenPayload } from '@/features/auth/model/auth.mappers';
import { httpClient } from '@/shared/api/httpClient';

export async function login(input: LoginInput, signal?: AbortSignal): Promise<AccessTokenPayload> {
  const payload = {
    email: input.email.trim(),
    password: input.password,
  };

  const response = await httpClient.post<AccessTokenResponseDto>(apiPaths.auth.login, payload, {
    signal,
    credentials: 'include',
  });

  return mapAccessTokenResponse(response);
}
