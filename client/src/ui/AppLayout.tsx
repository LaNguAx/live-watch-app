import { Outlet } from 'react-router-dom';
// import ConnectionHandler from './components/ConnectionHandler';

export default function AppLayout() {
  return (
    <div className="h-screen w-screen">
      <main className="w-full h-full">
        <Outlet />
      </main>
      {/* <ConnectionHandler /> */}
    </div>
  );
}
