import { screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { apiPaths, routePaths } from '@/app/router/paths';
import { appRoutes } from '@/app/router/route-registry';
import { renderWithProviders } from '@/test/test-utils';

describe('app router', () => {
  const fetchMock = vi.fn() as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);
    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

      if (url.includes(apiPaths.auth.refresh) || url.includes(apiPaths.auth.session)) {
        return Promise.resolve(
          new Response(
            JSON.stringify({ code: 'Auth.Unauthorized.InvalidRefreshToken', message: 'Invalid refresh token.' }),
            {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            },
          ),
        );
      }

      return Promise.resolve(new Response(null, { status: 404 }));
    });
  });

  it('renders public home route', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: [routePaths.home],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument();
  });

  it('renders public signup route', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: [routePaths.signup],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: 'Confirm your email' })).toBeInTheDocument();
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

  it('renders not found page for unknown route', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/missing-route'],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });
});
