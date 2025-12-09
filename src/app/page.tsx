'use client';

import * as React from 'react';

import { CompatibilityReport, createCompatibilityIssues } from '@/components/custom/compatibility-report';
import { EmailContentInput } from '@/components/custom/email-content-input';
import { EmailContentPreview } from '@/components/custom/email-content-preview';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from '@/components/ui/resizable';
import { useAsyncData } from '@/hooks/use-async-data';
import { useDebounce } from '@/hooks/use-debounce';
import { fetchCanIEmailData, type CanIEmailData, buildCssPropertyMap, type CanIEmailFeature } from '@/lib/caniemail';
import { extractFeatures } from '@/lib/css-extractor';

export default function EmailContentPreviewer() {
  const [html, setHtml] = React.useState('');
  const debouncedHtml = useDebounce(html, 300);
  const { data: canIEmailData, error, isLoading } = useAsyncData<CanIEmailData>(fetchCanIEmailData);

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
      <Header />

      {error && (
        <div className="bg-red-50 px-6 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          Failed to load compatibility data: {error}
        </div>
      )}

      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        <ResizablePanel defaultSize={30}>
          <EmailContentInput value={html} onChange={setHtml} />
        </ResizablePanel>

        <ResizableHandle isWithHandle />

        <ResizablePanel defaultSize={30}>
          <EmailContentPreview html={html} />
        </ResizablePanel>

        <ResizableHandle isWithHandle />

        <ResizablePanel defaultSize={40}>
          <CompatibilityReport issues={issues} isLoading={isLoading} />
        </ResizablePanel>
      </ResizablePanelGroup>

      <Footer canIEmailData={canIEmailData} />
    </div>
  );
}
