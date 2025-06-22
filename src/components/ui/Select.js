import React from 'react';
import { clsx } from 'clsx';

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={clsx(
        'block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm',
        'focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
        'disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export { Select }; 