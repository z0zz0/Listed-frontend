import type { GetAuthSessionResponseDto } from '@/features/auth/model/auth.dto';
import { mapGetAuthSessionResponse } from '@/features/auth/model/auth.mappers';
import type { AuthSession } from '@/features/auth/model/auth.types';
import { apiPaths } from '@/app/router/paths';
import { httpClient } from '@/shared/api/httpClient';

export async function getAuthSession(signal?: AbortSignal): Promise<AuthSession> {
  const response = await httpClient.get<GetAuthSessionResponseDto>(apiPaths.auth.session, {
    signal,
    credentials: 'include',
  });

  return mapGetAuthSessionResponse(response);
}
