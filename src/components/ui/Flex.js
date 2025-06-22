import React from 'react';
import { clsx } from 'clsx';

const Flex = ({
  children,
  className = '',
  as: Component = 'div',
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = 'nowrap',
  gap = 'none',
  ...props
}) => {
  const directionClasses = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    col: 'flex-col',
    'col-reverse': 'flex-col-reverse'
  };

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  };

  const wrapClasses = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse'
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
    'flex',
    directionClasses[direction],
    justifyClasses[justify],
    alignClasses[align],
    wrapClasses[wrap],
    gapClasses[gap],
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Flex; 