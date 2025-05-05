import { ReactNode } from 'react';

interface SideBarProps {
  children: ReactNode;
}

export default function SideBar({ children }: SideBarProps) {
  return (
    <div className="md:col-span-1 h-full flex flex-col gap-2">{children}</div>
  );
}
