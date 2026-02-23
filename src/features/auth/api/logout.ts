import { apiPaths } from '@/app/router/paths';
import { httpClient } from '@/shared/api/httpClient';

export function logout(signal?: AbortSignal) {
  return httpClient.post<void>(apiPaths.auth.logout, undefined, {
    signal,
    credentials: 'include',
  });
}
