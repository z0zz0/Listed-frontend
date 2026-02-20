import { createElement } from 'react';
import type { RouteObject } from 'react-router-dom';

import { RootLayout } from '@/app/router/root-layout';
import { usersRoutes } from '@/features/users/routes';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: createElement(RootLayout),
    children: [
      {
        index: true,
        element: createElement(HomePage),
      },
      usersRoutes,
      {
        path: '*',
        element: createElement(NotFoundPage),
      },
    ],
  },
];
