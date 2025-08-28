import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-full w-full max-w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 max-w-full">
        {children}
      </div>
    </div>
  );
}
