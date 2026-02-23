import { apiPaths } from '@/app/router/paths';
import type { CreateUserRequestDto, CreateUserResponseDto } from '@/features/users/model/user.dto';
import { httpClient } from '@/shared/api/httpClient';

export function createUser(payload: CreateUserRequestDto, signal?: AbortSignal) {
  return httpClient.post<CreateUserResponseDto>(apiPaths.users.root, payload, { signal });
}
