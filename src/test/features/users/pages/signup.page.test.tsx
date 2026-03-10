import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { apiPaths, routePaths } from '@/app/router/paths';
import { appRoutes } from '@/app/router/route-registry';
import { renderWithProviders } from '@/test/test-utils';

describe('signup page', () => {
  const fetchMock = vi.fn() as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);
    fetchMock.mockReset();
  });

  it('completes multi-step signup flow and redirects to user profile', async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

      if (url.includes(apiPaths.auth.refresh)) {
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

      if (url.includes(apiPaths.auth.session)) {
        const authHeader = input instanceof Request
          ? input.headers.get('Authorization')
          : new Headers(init?.headers).get('Authorization');

        if (authHeader === 'Bearer signup-token') {
          return Promise.resolve(
            new Response(JSON.stringify({ userId: 'u1', email: 'person@example.com' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }

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

      if (url.includes(apiPaths.users.signup.start)) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              signupId: '9de274fd-885f-4d59-a373-30df64995d20',
              email: 'person@example.com',
              codeExpiresAtUtc: '2026-03-09T10:00:00Z',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          ),
        );
      }

      if (url.includes(apiPaths.users.signup.verifyCode)) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              signupId: '9de274fd-885f-4d59-a373-30df64995d20',
              verifiedAtUtc: '2026-03-09T09:51:00Z',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          ),
        );
      }

      if (url.includes(apiPaths.users.signup.personalInfo)) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              signupId: '9de274fd-885f-4d59-a373-30df64995d20',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          ),
        );
      }

      if (url.includes(apiPaths.users.signup.complete)) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              id: 'c0807547-310e-45ea-98ba-c33ff6e05867',
              email: 'person@example.com',
              accessToken: {
                token: 'signup-token',
                expiresAtUtc: '2026-03-09T11:00:00Z',
                expiresInSeconds: 900,
              },
            }),
            {
              status: 201,
              headers: { 'Content-Type': 'application/json' },
            },
          ),
        );
      }

      return Promise.resolve(new Response(null, { status: 404 }));
    });

    const router = createMemoryRouter(appRoutes, {
      initialEntries: [routePaths.signup],
    });
    const user = userEvent.setup();

    renderWithProviders(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: 'Confirm your email' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Email'), 'person@example.com');
    await user.click(screen.getByRole('button', { name: 'Send verification code' }));

    expect(await screen.findByRole('heading', { name: 'Enter verification code' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Verification code'), '123456');
    await user.click(screen.getByRole('button', { name: 'Verify code' }));

    expect(await screen.findByRole('heading', { name: 'Complete your personal info' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('First name'), 'Anna');
    await user.type(screen.getByLabelText('Last name'), 'Smith');
    await user.selectOptions(screen.getByLabelText('Birth year'), '1990');
    await user.selectOptions(screen.getByLabelText('Birth month'), '1');
    await user.selectOptions(screen.getByLabelText('Birth day'), '1');
    await user.click(screen.getByRole('button', { name: 'Save personal info' }));

    expect(await screen.findByRole('heading', { name: 'Set your password' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Complete signup' }));

    expect(await screen.findByRole('heading', { name: 'User Profile' })).toBeInTheDocument();
  });
});
