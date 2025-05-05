import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto] ">
      <div className="overflow-y-auto">
        <main className="mx-auto max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
