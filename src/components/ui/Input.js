import React from 'react';
import { clsx } from 'clsx';

const Input = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const inputClasses = clsx(
    'input-field',
    error && 'border-error-500 focus:ring-error-500',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    className
  );
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={clsx(
          'mt-1 text-sm',
          error ? 'text-error-600' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input; 