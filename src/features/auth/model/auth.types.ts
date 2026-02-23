export const authStatus = {
  anonymous: 'anonymous',
  authenticated: 'authenticated',
  loading: 'loading',
} as const;

export type AuthStatus = (typeof authStatus)[keyof typeof authStatus];

export interface AuthSession {
  userId: string;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthContextValue {
  session: AuthSession | null;
  status: AuthStatus;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  hydrateSession: () => Promise<void>;
}
