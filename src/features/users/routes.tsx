import { Navigate, type RouteObject } from 'react-router-dom';

import { routeSegments } from '@/app/router/paths';
import { UserProfilePage } from '@/features/users/pages/UserProfilePage';

export const usersRoutes: RouteObject = {
  path: routeSegments.users.root,
  children: [
    {
      index: true,
      element: <Navigate to={routeSegments.users.me} replace />,
    },
    {
      path: routeSegments.users.me,
      element: <UserProfilePage />,
    },
  ],
};
