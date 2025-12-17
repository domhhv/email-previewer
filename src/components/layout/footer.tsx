import Link from 'next/link';
import * as React from 'react';

import type { CanIEmailData } from '@/lib/caniemail';

type FooterProps = {
  canIEmailData?: CanIEmailData | null;
};

export function Footer({ canIEmailData }: FooterProps) {
  return (
    <footer className="border-border flex flex-col gap-1 border-t px-6 py-3 text-center text-xs text-slate-400 dark:text-slate-500">
      <div className="flex items-center justify-center gap-1.5">
        <span>
          Built by{' '}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/domhhv"
            className="font-medium text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
          >
            Dominik Hryshaiev
          </Link>
        </span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-emerald-500 align-middle" />
          Available for hire
        </span>
      </div>
      <div className="flex flex-col md:flex-row md:justify-center">
        <span>
          Compatibility data powered by{' '}
          <Link target="_blank" rel="noopener noreferrer" href="https://www.caniemail.com">
            caniemail.com
          </Link>
          {canIEmailData && ` (${canIEmailData.data.length} features)`}
        </span>
      </div>
    </footer>
  );
}
