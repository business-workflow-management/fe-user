import React from 'react';
import { clsx } from 'clsx';

const Paragraph = ({
  children,
  className = '',
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'default',
  align = 'left',
  leading = 'default',
  ...props
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
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
    black: 'font-black'
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    success: 'text-success-600',
    error: 'text-error-600',
    warning: 'text-warning-600',
    white: 'text-white',
    black: 'text-black',
    default: 'text-gray-700'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  const leadingClasses = {
    none: 'leading-none',
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
    default: 'leading-normal'
  };

  const classes = clsx(
    sizeClasses[size],
    weightClasses[weight],
    colorClasses[color],
    alignClasses[align],
    leadingClasses[leading],
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Paragraph; 