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
