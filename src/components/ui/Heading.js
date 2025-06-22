import React from 'react';
import { clsx } from 'clsx';

const Heading = ({
  children,
  level = 1,
  className = '',
  as,
  size,
  weight = 'default',
  color = 'default',
  ...props
}) => {
  const Component = as || `h${level}`;

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
    '8xl': 'text-8xl',
    '9xl': 'text-9xl'
  };

  const weightClasses = {
    thin: 'font-thin',
    extralight: 'font-extralight',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black',
    default: 'font-semibold'
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    success: 'text-success-600',
    error: 'text-error-600',
    warning: 'text-warning-600',
    white: 'text-white',
    black: 'text-black',
    default: 'text-gray-900'
  };

  // Default size based on level if not specified
  const defaultSizes = {
    1: '3xl',
    2: '2xl',
    3: 'xl',
    4: 'lg',
    5: 'base',
    6: 'sm'
  };

  const finalSize = size || defaultSizes[level] || 'base';

  const classes = clsx(
    sizeClasses[finalSize],
    weightClasses[weight],
    colorClasses[color],
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Heading; 