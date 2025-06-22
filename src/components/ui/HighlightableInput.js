import React, { useRef, useEffect } from 'react';
import { clsx } from 'clsx';

const HighlightedText = ({ text }) => {
  const safeText = String(text || '');
  const parts = safeText.split(/({{.*?}})/g);

  return (
    <>
      {parts.map((part, i) =>
        /{{.*?}}/.test(part) ? (
          <span key={i} className="text-blue-600 font-semibold">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const HighlightableInput = ({ as = 'input', value, className, ...props }) => {
  const Comp = as;
  const backdropRef = useRef(null);
  const inputRef = useRef(null);

  const handleScroll = () => {
    if (backdropRef.current && inputRef.current) {
      backdropRef.current.scrollTop = inputRef.current.scrollTop;
      backdropRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    handleScroll();
  }, [value]);

  const sharedStyles = 'w-full py-2 px-3 sm:text-sm';
  
  const backdropStyles =
    'absolute top-0 left-0 h-full w-full overflow-auto whitespace-pre-wrap pointer-events-none z-0';
  
  const inputStyles = 'bg-transparent text-transparent caret-gray-800 relative z-10 focus:outline-none';
  
  const wrapperStyles =
    'relative mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500';

  return (
    <div className={clsx(wrapperStyles, className)}>
      <div ref={backdropRef} className={clsx(sharedStyles, backdropStyles)}>
        <HighlightedText text={value} />
        {/* Suffix to ensure height is consistent */}
        &nbsp;
      </div>
      <Comp
        ref={inputRef}
        {...props}
        value={value}
        onScroll={handleScroll}
        className={clsx(sharedStyles, inputStyles)}
      />
    </div>
  );
};

export default HighlightableInput; 