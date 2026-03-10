import { createElement } from 'react';
import type { RouteObject } from 'react-router-dom';

import { routePaths, routeSegments } from '@/app/router/paths';
import { RedirectIfAuthenticated } from '@/app/router/guards/RedirectIfAuthenticated';
import { RequireAuth } from '@/app/router/guards/RequireAuth';
import { RootLayout } from '@/app/router/root-layout';
import { SignUpPage } from '@/features/users/pages/SignUpPage';
import { usersRoutes } from '@/features/users/routes';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const appRoutes: RouteObject[] = [
  {
    path: routePaths.home,
    element: createElement(RootLayout),
    children: [
      {
        element: createElement(RedirectIfAuthenticated),
        children: [
          {
            index: true,
            element: createElement(HomePage),
          },
          {
            path: routeSegments.signup,
            element: createElement(SignUpPage),
          },
        ],
      },
      {
        element: createElement(RequireAuth),
        children: [usersRoutes],
      },
      {
        path: routeSegments.wildcard,
        element: createElement(NotFoundPage),
      },
    ],
  },
];
