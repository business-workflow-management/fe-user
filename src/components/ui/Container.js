import React from 'react';
import { clsx } from 'clsx';

const Container = ({
  children,
  className = '',
  as: Component = 'div',
  maxWidth = 'default',
  padding = 'default',
  center = false,
  ...props
}) => {
  const maxWidthClasses = {
    none: '',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
    default: 'max-w-7xl'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
    xl: 'px-12 py-8',
    default: 'px-4 sm:px-6 lg:px-8'
  };

  const classes = clsx(
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    center && 'mx-auto',
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Container; 