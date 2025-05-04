import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../ui/AppLayout';
import Home from '../ui/pages/Home';
import Room from '../ui/pages/Room';
import { Error as ErrorPage } from '../ui/pages/Error';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage error={new Error('Page not found')} />,
    children: [
      {
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage error={new Error('Failed to load Home')} />,
      },
      {
        path: '/room/:roomId',
        element: <Room />,
        errorElement: <ErrorPage error={new Error('Failed to load Room')} />,
      },
    ],
  },
]);

export default router;
