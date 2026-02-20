import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

import { AuthProvider } from '@/app/providers/AuthProvider';

export function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return {
    queryClient,
    ...render(
      <AuthProvider>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </AuthProvider>,
    ),
  };
}
