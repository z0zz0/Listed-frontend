import { httpClient } from '@/shared/api/httpClient';
import type { GetUserResponseDto } from '@/features/users/model/user.dto';

export function getUserByEmail(email: string, signal?: AbortSignal) {
  const queryValue = encodeURIComponent(email);

  return httpClient.get<GetUserResponseDto>(`/api/users/by-email?email=${queryValue}`, { signal });
}
