import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CreateUserForm } from '@/features/users/ui/CreateUserForm';
import { renderWithProviders } from '@/test/test-utils';

describe('CreateUserForm', () => {
  const fetchMock = vi.fn() as unknown as typeof fetch;

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockReset();
  });

  it('blocks invalid input and does not submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateUserForm />);

    await user.type(screen.getByLabelText('Email'), 'bad-email');
    await user.type(screen.getByLabelText('Password'), '123');
    await user.click(screen.getByRole('button', { name: 'Create User' }));

    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(await screen.findByText('Password must be at least 8 characters.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows backend error from failed submit', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ code: 'User.Conflict.EmailAlreadyInUse', message: 'Email already exists.' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<CreateUserForm />);

    await user.type(screen.getByLabelText('Email'), 'taken@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Create User' }));

    expect(await screen.findByText('Email already exists.')).toBeInTheDocument();
  });
});
