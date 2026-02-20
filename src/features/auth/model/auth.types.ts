export type AuthStatus = 'anonymous' | 'authenticated' | 'loading';

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
  refreshSession: () => Promise<void>;
}
