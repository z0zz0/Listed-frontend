import { completeSignup, saveSignupProfile, startSignup, verifySignupEmail } from '@/features/users/api/signup';

describe('signup api', () => {
  const fetchMock = vi.fn() as unknown as typeof fetch;

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockReset();
  });

  it('maps start signup success response', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          signupId: '9de274fd-885f-4d59-a373-30df64995d20',
          email: 'person@example.com',
          codeExpiresAtUtc: '2026-03-08T12:34:56Z',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    const result = await startSignup('person@example.com');

    expect(result).toEqual({
      signupId: '9de274fd-885f-4d59-a373-30df64995d20',
      email: 'person@example.com',
      codeExpiresAtUtc: '2026-03-08T12:34:56Z',
    });
  });

  it('maps verify signup email success response', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          signupId: '9de274fd-885f-4d59-a373-30df64995d20',
          verifiedAtUtc: '2026-03-08T12:36:00Z',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    const result = await verifySignupEmail('9de274fd-885f-4d59-a373-30df64995d20', '123456');

    expect(result).toEqual({
      signupId: '9de274fd-885f-4d59-a373-30df64995d20',
      verifiedAtUtc: '2026-03-08T12:36:00Z',
    });
  });

  it('maps save signup profile success response', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
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

    const result = await saveSignupProfile('9de274fd-885f-4d59-a373-30df64995d20', 'Anna', 'Smith', '1990-04-02');

    expect(result).toEqual({
      signupId: '9de274fd-885f-4d59-a373-30df64995d20',
    });
  });

  it('maps complete signup success response', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: '98af4dc0-86a9-4926-9d41-47d761032727',
          email: 'person@example.com',
          accessToken: {
            token: 'token-123',
            expiresAtUtc: '2026-03-09T08:00:00Z',
            expiresInSeconds: 900,
          },
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    const result = await completeSignup('9de274fd-885f-4d59-a373-30df64995d20', 'password123');

    expect(result.id).toBe('98af4dc0-86a9-4926-9d41-47d761032727');
    expect(result.email).toBe('person@example.com');
    expect(result.accessToken).toEqual({
      accessToken: 'token-123',
      expiresAtUtc: '2026-03-09T08:00:00Z',
      expiresInSeconds: 900,
    });
  });

  it('maps verify signup email rate-limit error response', async () => {
    (fetchMock as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          code: 'User.RateLimit.VerificationAttemptsExceeded',
          message: 'Verification attempts exceeded.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    await expect(verifySignupEmail('9de274fd-885f-4d59-a373-30df64995d20', '123456')).rejects.toMatchObject({
      status: 429,
      code: 'User.RateLimit.VerificationAttemptsExceeded',
      message: 'Verification attempts exceeded.',
    });
  });
});
