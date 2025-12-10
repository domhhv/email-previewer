'use client';

import * as React from 'react';

import { useDebounceCallback } from './use-debounce-callback';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

type WindowSize<T extends number | undefined = number | undefined> = {
  height: T;
  width: T;
};

type UseWindowSizeOptions<InitializeWithValue extends boolean | undefined> = {
  debounceDelay?: number;
  initializeWithValue: InitializeWithValue;
};

const IS_SERVER = typeof window === 'undefined';

function useEventListener(eventName: string, handler: () => void) {
  const savedHandler = React.useRef(handler);

  React.useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(() => {
    if (IS_SERVER) {
      return;
    }

    function eventListener() {
      return savedHandler.current();
    }

    window.addEventListener(eventName, eventListener);

    return () => {
      return window.removeEventListener(eventName, eventListener);
    };
  }, [eventName]);
}

export function useWindowSize(options: UseWindowSizeOptions<false>): WindowSize;

export function useWindowSize(options?: Partial<UseWindowSizeOptions<true>>): WindowSize<number>;

export function useWindowSize(options: Partial<UseWindowSizeOptions<boolean>> = {}): WindowSize | WindowSize<number> {
  let { initializeWithValue = true } = options;

  if (IS_SERVER) {
    initializeWithValue = false;
  }

  const [windowSize, setWindowSize] = React.useState<WindowSize>(() => {
    if (initializeWithValue) {
      return {
        height: window.innerHeight,
        width: window.innerWidth,
      };
    }

    return {
      height: undefined,
      width: undefined,
    };
  });

  const debouncedSetWindowSize = useDebounceCallback(setWindowSize, options.debounceDelay);

  function handleSize() {
    const setSize = options.debounceDelay ? debouncedSetWindowSize : setWindowSize;

    setSize({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }

  useEventListener('resize', handleSize);

  useIsomorphicLayoutEffect(() => {
    handleSize();
  }, []);

  return windowSize;
}
