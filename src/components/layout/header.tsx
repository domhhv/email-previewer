import Link from 'next/link';
import * as React from 'react';

import { ThemeModeToggle } from '@/components/custom/theme-mode-toggle';
import { GithubIcon } from '@/components/icons/github';

export function Header() {
  return (
    <header className="border-border flex items-center justify-between gap-4 border-b px-5 py-3">
      <div>
        <h1 className="text-xl">Email Client Previewer</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Test your email HTML against major email clients</p>
      </div>
      <div className="flex items-center gap-4">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/domhhv/email-previewer"
          className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
        >
          <GithubIcon className="size-5" />
        </Link>
        <ThemeModeToggle />
      </div>
    </header>
  );
}
