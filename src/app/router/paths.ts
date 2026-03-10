export const routePaths = {
  home: '/',
  signup: '/signup',
  users: {
    root: '/users',
    me: '/users/me',
  },
} as const;

export const routeSegments = {
  signup: 'signup',
  users: {
    root: 'users',
    me: 'me',
  },
  wildcard: '*',
} as const;

export const apiPaths = {
  auth: {
    login: '/api/auth/login',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
    logoutAll: '/api/auth/logout-all',
    session: '/api/auth/session',
  },
  users: {
    root: '/api/users',
    signup: {
      start: '/api/users/signup/start',
      verifyCode: '/api/users/signup/verify-code',
      personalInfo: '/api/users/signup/personal-info',
      complete: '/api/users/signup/complete',
    },
  },
} as const;
