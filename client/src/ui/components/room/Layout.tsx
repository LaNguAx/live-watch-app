import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full max-w-full">
      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen gap-4 lg:gap-6 max-w-full">
        {children}
      </div>
    </div>
  );
}
