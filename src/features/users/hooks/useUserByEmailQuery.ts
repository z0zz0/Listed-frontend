import { useQuery } from '@tanstack/react-query';

import { getUserByEmail } from '@/features/users/api/getUserByEmail';
import { mapGetUserResponse } from '@/features/users/model/user.mappers';

export const usersQueryKeys = {
  root: ['users'] as const,
  byEmail: (email: string) => ['users', 'by-email', email] as const,
};

export function useUserByEmailQuery(email: string | null) {
  return useQuery({
    queryKey: email ? usersQueryKeys.byEmail(email) : [...usersQueryKeys.root, 'by-email', 'idle'],
    queryFn: async () => {
      if (!email) {
        throw new Error('validation.email.requiredForFetch');
      }

      const response = await getUserByEmail(email);
      return mapGetUserResponse(response);
    },
    enabled: Boolean(email),
    retry: false,
  });
}
