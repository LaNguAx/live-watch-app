import { ReactNode } from 'react';

interface RoomDetailsProps {
  children: ReactNode;
}

export default function RoomDetails({ children }: RoomDetailsProps) {
  return <div className="max-w-lg md:max-w-none h-fit">{children}</div>;
}
