import { screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { appRoutes } from '@/app/router/route-registry';
import { renderWithProviders } from '@/test/test-utils';

describe('app router', () => {
  it('renders /users/new route', () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/users/new'],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: 'Create User' })).toBeInTheDocument();
  });

  it('renders /users/by-email route', () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/users/by-email'],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: 'Find User By Email' })).toBeInTheDocument();
  });

  it('renders not found page for unknown route', () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/missing-route'],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });
});
