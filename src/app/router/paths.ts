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
    me: '/api/auth/me',
  },
  users: {
    root: '/api/users',
    byEmail: '/api/users/by-email',
  },
} as const;
