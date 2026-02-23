import { apiPaths } from '@/app/router/paths';
import type { GetUserResponseDto } from '@/features/users/model/user.dto';
import { httpClient } from '@/shared/api/httpClient';

export function getUserByEmail(email: string, signal?: AbortSignal) {
  const queryValue = encodeURIComponent(email);

  return httpClient.get<GetUserResponseDto>(`${apiPaths.users.byEmail}?email=${queryValue}`, { signal });
}
