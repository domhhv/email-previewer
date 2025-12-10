import * as React from 'react';

import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'mobile-swipe-hint-dismissed';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);

  return () => {
    return window.removeEventListener('storage', callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

function getServerSnapshot() {
  return true;
}

export function MobileSwipeHint() {
  const isDismissed = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleDismiss = React.useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    window.dispatchEvent(new Event('storage'));
  }, []);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-muted-foreground text-xs">Swipe these buttons to change view mode</span>
      <Button size="sm" variant="ghost" onClick={handleDismiss} className="h-6 px-1 text-xs underline">
        Ok, got it
      </Button>
    </div>
  );
}
