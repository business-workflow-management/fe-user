import React from 'react';
import { clsx } from 'clsx';

const Grid = ({
  children,
  className = '',
  as: Component = 'div',
  cols = 1,
  gap = 'none',
  ...props
}) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
    none: 'grid-cols-none'
  };

  const gapClasses = {
    none: '',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12'
  };

  const classes = clsx(
    'grid',
    colsClasses[cols],
    gapClasses[gap],
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Grid; 