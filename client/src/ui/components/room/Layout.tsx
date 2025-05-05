import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
        {children}
      </div>
    </div>
  );
}
