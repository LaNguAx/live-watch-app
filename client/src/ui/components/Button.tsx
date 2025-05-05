import { Link } from 'react-router-dom';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  to?: string;
  type?: string;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  disabled,
  to,
  type,
  className = 'cursor-pointer w-fit rounded-full bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 transition',
  onClick: handler,
}: ButtonProps) {
  if (to)
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );

  if (handler)
    return (
      <button disabled={disabled} className={className} onClick={handler}>
        {children}
      </button>
    );
  return (
    <button disabled={disabled} className={className}>
      {children}
    </button>
  );
}
