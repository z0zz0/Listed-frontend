import { httpClient } from '@/shared/api/httpClient';
import type { CreateUserRequestDto, CreateUserResponseDto } from '@/features/users/model/user.dto';

export function createUser(payload: CreateUserRequestDto, signal?: AbortSignal) {
  return httpClient.post<CreateUserResponseDto>('/api/users', payload, { signal });
}
