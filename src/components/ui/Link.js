import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { clsx } from 'clsx';

const Link = ({
  children,
  to,
  href,
  className = '',
  variant = 'default',
  size = 'base',
  external = false,
  ...props
}) => {
  const variantClasses = {
    default: 'text-primary-600 hover:text-primary-700 underline',
    primary: 'text-primary-600 hover:text-primary-700',
    secondary: 'text-gray-600 hover:text-gray-800',
    success: 'text-success-600 hover:text-success-700',
    error: 'text-error-600 hover:text-error-700',
    warning: 'text-warning-600 hover:text-warning-700'
  };

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const classes = clsx(
    'transition-colors duration-200',
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  // If external link or href is provided, use anchor tag
  if (external || href) {
    return (
      <a
        href={href || to}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    );
  }

  // If internal link, use React Router Link
  if (to) {
    return (
      <RouterLink to={to} className={classes} {...props}>
        {children}
      </RouterLink>
    );
  }

  // Fallback to button if no link target
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Link; 