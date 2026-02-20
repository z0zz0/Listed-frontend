import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createUser } from '@/features/users/api/createUser';
import { mapCreateUserResponse } from '@/features/users/model/user.mappers';
import type { CreateUserRequestDto } from '@/features/users/model/user.dto';
import { usersQueryKeys } from '@/features/users/hooks/useUserByEmailQuery';

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserRequestDto) => {
      const response = await createUser(payload);
      return mapCreateUserResponse(response);
    },
    onSuccess: async (_result, variables) => {
      await queryClient.invalidateQueries({
        queryKey: usersQueryKeys.byEmail(variables.email),
      });
    },
  });
}
