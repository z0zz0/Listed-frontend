import { createUser } from '@/features/users/api/createUser';
import { getUserByEmail } from '@/features/users/api/getUserByEmail';

describe('users api', () => {
  const fetchMock = vi.fn() as unknown as typeof fetch;

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockReset();
  });

  it('maps create user success response', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'abc', email: 'person@example.com' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await createUser({
      email: 'person@example.com',
      password: 'password123',
    });

    expect(result).toEqual({ id: 'abc', email: 'person@example.com' });
  });

  it('maps create user validation error response', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ code: 'User.Validation.InvalidEmail', message: 'Invalid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(
      createUser({
        email: 'bad-email',
        password: 'password123',
      }),
    ).rejects.toMatchObject({
      status: 400,
      code: 'User.Validation.InvalidEmail',
      message: 'Invalid email address.',
    });
  });

  it('maps create user conflict error response', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ code: 'User.Conflict.EmailAlreadyInUse', message: 'Email already exists.' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(
      createUser({
        email: 'taken@example.com',
        password: 'password123',
      }),
    ).rejects.toMatchObject({
      status: 409,
      code: 'User.Conflict.EmailAlreadyInUse',
      message: 'Email already exists.',
    });
  });

  it('maps get user by email response', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: 'u1',
          email: 'person@example.com',
          isVerified: true,
          isSoftDeleted: false,
          userInfo: null,
          photos: [],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    const result = await getUserByEmail('person@example.com');

    expect(result.email).toBe('person@example.com');
    expect(result.id).toBe('u1');
  });

  it('maps get user by email not found error', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ code: 'User.NotFound.ByEmail', message: 'User not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(getUserByEmail('missing@example.com')).rejects.toMatchObject({
      status: 404,
      code: 'User.NotFound.ByEmail',
      message: 'User not found.',
    });
  });
});
