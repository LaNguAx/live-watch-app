import { Link } from 'react-router-dom';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  to?: string;
  type?: string;
  className?: string;
  extraClasses?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  disabled,
  to,
  className = 'cursor-pointer w-fit rounded-full bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 transition',
  extraClasses = '',
  onClick: handler,
}: ButtonProps) {
  if (to)
    return (
      <Link to={to} className={`${className} ${extraClasses}`}>
        {children}
      </Link>
    );

  if (handler)
    return (
      <button
        disabled={disabled}
        className={`${className} ${extraClasses}`}
        onClick={handler}
      >
        {children}
      </button>
    );
  return (
    <button disabled={disabled} className={`${className} ${extraClasses}`}>
      {children}
    </button>
  );
}
