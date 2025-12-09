import * as React from 'react';

export function useHasKeyboard() {
  const [hasKeyboard, setHasKeyboard] = React.useState(true);

  React.useEffect(() => {
    const canHover = window.matchMedia('(hover: hover)').matches;

    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    setHasKeyboard(canHover && hasFinePointer);
  }, []);

  return hasKeyboard;
}
