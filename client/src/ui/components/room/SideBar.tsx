import { ReactNode } from 'react';

interface SideBarProps {
  children: ReactNode;
}

export default function SideBar({ children }: SideBarProps) {
  return (
    <div className="flex flex-col gap-4 lg:gap-2 lg:h-full lg:min-h-0">
      {children}
    </div>
  );
}
