import { Navigate, type RouteObject } from 'react-router-dom';

import { CreateUserPage } from '@/features/users/pages/CreateUserPage';
import { GetUserByEmailPage } from '@/features/users/pages/GetUserByEmailPage';

export const usersRoutes: RouteObject = {
  path: 'users',
  children: [
    {
      index: true,
      element: <Navigate to="by-email" replace />,
    },
    {
      path: 'new',
      element: <CreateUserPage />,
    },
    {
      path: 'by-email',
      element: <GetUserByEmailPage />,
    },
  ],
};
