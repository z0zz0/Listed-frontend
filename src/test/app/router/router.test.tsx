import { screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { routePaths } from '@/app/router/paths';
import { appRoutes } from '@/app/router/route-registry';
import { renderWithProviders } from '@/test/test-utils';

describe('app router', () => {
  it('renders public home route', () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: [routePaths.home],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument();
  });

  it('renders public signup route', () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: [routePaths.signup],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('redirects anonymous users from /users/me to /', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: [routePaths.users.me],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument();
  });

  it('redirects anonymous users from /users to /', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: [routePaths.users.root],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument();
  });

  it('renders not found page for unknown route', () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/missing-route'],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });
});
