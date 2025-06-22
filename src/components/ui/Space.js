import React from 'react';
import { clsx } from 'clsx';

const Space = ({
  children,
  className = '',
  as: Component = 'div',
  size = 'md',
  direction = 'vertical',
  ...props
}) => {
  const sizeClasses = {
    none: '',
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-12'
  };

  const directionClasses = {
    vertical: 'space-y-4',
    horizontal: 'space-x-4'
  };

  const classes = clsx(
    direction === 'vertical' ? sizeClasses[size] : directionClasses[direction],
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Space; 