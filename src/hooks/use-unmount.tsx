'use client';

import * as React from 'react';

export function useUnmount(fn: () => void): void {
  if (typeof fn !== 'function') {
    throw new Error('useUnmount expects a function as argument');
  }

  const fnRef = React.useRef(fn);

  // eslint-disable-next-line react-hooks/refs
  fnRef.current = fn;

  React.useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
}
