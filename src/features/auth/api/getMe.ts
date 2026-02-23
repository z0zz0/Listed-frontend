import type { GetMeResponseDto } from '@/features/auth/model/auth.dto';
import { mapGetMeResponse } from '@/features/auth/model/auth.mappers';
import type { AuthSession } from '@/features/auth/model/auth.types';
import { apiPaths } from '@/app/router/paths';
import { httpClient } from '@/shared/api/httpClient';

export async function getMe(signal?: AbortSignal): Promise<AuthSession> {
  const response = await httpClient.get<GetMeResponseDto>(apiPaths.auth.me, {
    signal,
    credentials: 'include',
  });

  return mapGetMeResponse(response);
}
