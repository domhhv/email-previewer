import Link from 'next/link';
import * as React from 'react';

import type { CanIEmailData } from '@/lib/caniemail';

type FooterProps = {
  canIEmailData?: CanIEmailData | null;
};

export function Footer({ canIEmailData }: FooterProps) {
  return (
    <footer className="border-border flex flex-col border-t px-6 py-3 text-center text-xs text-slate-400 md:flex-row md:justify-center md:text-center dark:text-slate-500">
      <span>
        Compatibility data powered by{' '}
        <Link target="_blank" rel="noopener noreferrer" href="https://www.caniemail.com">
          caniemail.com
        </Link>
        {canIEmailData && ` (${canIEmailData.data.length} features)`}
      </span>
      <span>
        <span className="hidden md:inline-block">&nbsp;⋅&nbsp;</span>Email favicon created by lakonicon on{' '}
        <Link target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com/free-icons/email">
          Flaticon
        </Link>
      </span>
    </footer>
  );
}
