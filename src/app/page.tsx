'use client';

import Link from 'next/link';
import * as React from 'react';

import { CompatibilityReport, createCompatibilityIssues } from '@/components/custom/compatibility-report';
import { EmailContentInput } from '@/components/custom/email-content-input';
import { EmailContentPreview } from '@/components/custom/email-content-preview';
import { ThemeModeToggle } from '@/components/custom/theme-mode-toggle';
import { useAsyncData } from '@/hooks/use-async-data';
import { useDebounce } from '@/hooks/use-debounce';
import { fetchCanIEmailData, type CanIEmailData, buildCssPropertyMap, type CanIEmailFeature } from '@/lib/caniemail';
import { extractFeatures } from '@/lib/css-extractor';

export default function EmailContentPreviewer() {
  const [html, setHtml] = React.useState('');
  const debouncedHtml = useDebounce(html, 300);
  const {
    data: canIEmailData,
    error,
    isLoading,
  } = useAsyncData<CanIEmailData>(fetchCanIEmailData, 'Failed to load compatibility data. Please refresh the page.');

  const cssPropertyMap = React.useMemo(() => {
    return canIEmailData ? buildCssPropertyMap(canIEmailData) : new Map<string, CanIEmailFeature>();
  }, [canIEmailData]);

  const issues = React.useMemo(() => {
    if (!debouncedHtml.trim() || cssPropertyMap.size === 0) {
      return [];
    }

    const extracted = extractFeatures(debouncedHtml);

    return createCompatibilityIssues(extracted.cssProperties, cssPropertyMap);
  }, [debouncedHtml, cssPropertyMap]);

  return (
    <div className="flex h-screen flex-col">
      <header className="border-border flex items-center justify-between border-b px-5 py-3">
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
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </Link>
          <ThemeModeToggle />
        </div>
      </header>

      {error && (
        <div className="bg-red-50 px-6 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-1/3 min-w-[300px] flex-col border-r">
          <EmailContentInput value={html} onChange={setHtml} />
        </div>

        <div className="border-border flex w-1/3 min-w-[300px] flex-col border-r">
          <EmailContentPreview html={html} />
        </div>

        <div className="flex min-w-[350px] flex-1 flex-col">
          <CompatibilityReport issues={issues} isLoading={isLoading} />
        </div>
      </div>

      <footer className="border-border border-t px-6 py-3 text-center text-xs text-slate-400 dark:text-slate-500">
        Compatibility data powered by{' '}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.caniemail.com"
          className="text-sky-500 hover:text-sky-400"
        >
          caniemail.com
        </Link>
        {canIEmailData && ` (${canIEmailData.data.length} features)`}
      </footer>
    </div>
  );
}
