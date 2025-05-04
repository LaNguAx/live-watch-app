import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import './styles/index.css';

export default function App() {
  return <RouterProvider router={router} />;
}
