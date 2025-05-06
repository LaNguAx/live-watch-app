import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="h-screen w-screen ">
      <div className="overflow-y-auto">
        <main className="mx-auto max-w-7xl sm:max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
