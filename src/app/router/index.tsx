import { createBrowserRouter } from 'react-router-dom';

import { appRoutes } from '@/app/router/route-registry';

export const router = createBrowserRouter(appRoutes);
