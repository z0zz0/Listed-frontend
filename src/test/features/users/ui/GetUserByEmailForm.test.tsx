import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GetUserByEmailForm } from '@/features/users/ui/GetUserByEmailForm';
import { renderWithProviders } from '@/test/test-utils';

describe('GetUserByEmailForm', () => {
  const fetchMock = vi.fn() as unknown as typeof fetch;

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockReset();
  });

  it('shows not found error when backend returns 404', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ code: 'User.NotFound.ByEmail', message: 'User was not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<GetUserByEmailForm />);

    await user.type(screen.getByLabelText('Email'), 'missing@example.com');
    await user.click(screen.getByRole('button', { name: 'Search User' }));

    expect(await screen.findByText('User was not found.')).toBeInTheDocument();
  });

  it('shows user details for a successful lookup', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: 'u1',
          email: 'person@example.com',
          isVerified: true,
          isSoftDeleted: false,
          userInfo: {
            nationality: 'AL',
            firstName: 'Edlir',
            lastName: 'Konsler',
            phoneNumber: '1234567',
            hasPhonePrefix: false,
            biography: 'Bio',
          },
          photos: [],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    const user = userEvent.setup();
    renderWithProviders(<GetUserByEmailForm />);

    await user.type(screen.getByLabelText('Email'), 'person@example.com');
    await user.click(screen.getByRole('button', { name: 'Search User' }));

    expect(await screen.findByText('User Details')).toBeInTheDocument();
    expect(screen.getByText('person@example.com')).toBeInTheDocument();
  });
});
