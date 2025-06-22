import React from 'react';
import { clsx } from 'clsx';

const Card = ({
  children,
  className = '',
  padding = 'p-6',
  shadow = 'shadow-sm',
  border = 'border border-gray-200',
  ...props
}) => {
  const classes = clsx(
    'bg-white',
    padding,
    shadow,
    border,
    className
  );
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card; 