import { ReactNode } from 'react';

interface SideBarProps {
  children: ReactNode;
}

export default function SideBar({ children }: SideBarProps) {
  return (
    <div className="h-full flex flex-col gap-4 lg:gap-2 lg:min-h-0">
      {children}
    </div>
  );
}
