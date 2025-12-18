'use client';

import { BugIcon, FullscreenIcon, TextCursorInputIcon } from 'lucide-react';
import * as React from 'react';
import { useSwipeable } from 'react-swipeable';

import { CompatibilityReport } from '@/components/custom/compatibility-report';
import { EmailContentInput } from '@/components/custom/email-content-input';
import { EmailContentPreview } from '@/components/custom/email-content-preview';
import { MobileSwipeHint } from '@/components/custom/mobile-swipe-hint';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from '@/components/ui/resizable';
import { Spinner } from '@/components/ui/spinner';
import { useAsyncData } from '@/hooks/use-async-data';
import { useDebounce } from '@/hooks/use-debounce';
import { useWindowSize } from '@/hooks/use-window-size';
import { fetchCanIEmailData, createCompatibilityIssues } from '@/lib/caniemail';
import type { CanIEmailData, CanIEmailFeature } from '@/lib/caniemail';
import { extractFeatures } from '@/lib/feature-extractor';
import { buildCssPropertyMap, buildHtmlElementMap, buildHtmlAttributeMap } from '@/lib/feature-map-builders';
import { cn } from '@/lib/utils';

const VIEW_MODES = ['input', 'preview', 'report'] as const;
type ViewMode = (typeof VIEW_MODES)[number];

export default function EmailContentPreviewer() {
  const [html, setHtml] = React.useState('');
  const [viewMode, setViewMode] = React.useState<ViewMode>('input');
  const debouncedHtml = useDebounce(html, 300);
  const { data: canIEmailData, error, isLoading } = useAsyncData<CanIEmailData>(fetchCanIEmailData);
  const { width } = useWindowSize();
  const [isMounted, setIsMounted] = React.useState(false);
  const isMobile = width < 768;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const cycleViewMode = React.useCallback(
    (direction: 'left' | 'right') => {
      const currentIndex = VIEW_MODES.indexOf(viewMode as ViewMode);
      let nextIndex: number;

      if (direction === 'left') {
        nextIndex = (currentIndex + 1) % VIEW_MODES.length;
      } else {
        nextIndex = (currentIndex - 1 + VIEW_MODES.length) % VIEW_MODES.length;
      }

      setViewMode(VIEW_MODES[nextIndex]);
    },
    [viewMode, setViewMode]
  );

  const swipeHandlers = useSwipeable({
    delta: 50,
    preventScrollOnSwipe: true,
    trackMouse: false,
    onSwipedLeft: () => {
      return cycleViewMode('left');
    },
    onSwipedRight: () => {
      return cycleViewMode('right');
    },
  });

  const [cssPropertyMap, htmlAttributeMap, htmlElementMap] = React.useMemo(() => {
    if (!canIEmailData) {
      return [
        new Map<string, CanIEmailFeature>(),
        new Map<string, CanIEmailFeature>(),
        new Map<string, CanIEmailFeature>(),
      ];
    }

    const { data: features } = canIEmailData;

    return [buildCssPropertyMap(features), buildHtmlAttributeMap(features), buildHtmlElementMap(features)];
  }, [canIEmailData]);

  const issues = React.useMemo(() => {
    if (!debouncedHtml.trim() || cssPropertyMap.size === 0) {
      return [];
    }

    const extracted = extractFeatures(debouncedHtml);

    return createCompatibilityIssues(
      extracted.cssProperties,
      extracted.cssAtRules,
      extracted.htmlElements,
      extracted.htmlAttributes,
      cssPropertyMap,
      htmlElementMap,
      htmlAttributeMap
    );
  }, [debouncedHtml, cssPropertyMap, htmlElementMap, htmlAttributeMap]);

  if (!isMounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isMobile) {
    return (
      <div className="flex h-screen flex-col">
        <Header />

        {error && (
          <div className="bg-red-50 px-6 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            Failed to load compatibility data: {error}
          </div>
        )}

        <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
          <ResizablePanel minSize={20} defaultSize={30}>
            <EmailContentInput value={html} onChange={setHtml} />
          </ResizablePanel>

          <ResizableHandle isWithHandle />

          <ResizablePanel maxSize={50} minSize={15} defaultSize={35}>
            <EmailContentPreview html={html} />
          </ResizablePanel>

          <ResizableHandle isWithHandle />

          <ResizablePanel minSize={20} defaultSize={30}>
            <CompatibilityReport issues={issues} isLoading={isLoading} />
          </ResizablePanel>
        </ResizablePanelGroup>

        <Footer canIEmailData={canIEmailData} />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />

      {error && (
        <div className="bg-red-50 px-6 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          Failed to load compatibility data: {error}
        </div>
      )}

      <div {...swipeHandlers} className="relative flex flex-1 overflow-hidden">
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            viewMode === 'input' ? 'translate-x-0' : viewMode === 'preview' ? '-translate-x-full' : '-translate-x-full'
          }`}
        >
          <EmailContentInput value={html} onChange={setHtml} />
        </div>

        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            viewMode === 'preview' ? 'translate-x-0' : viewMode === 'input' ? 'translate-x-full' : '-translate-x-full'
          }`}
        >
          <EmailContentPreview html={html} />
        </div>

        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            viewMode === 'report' ? 'translate-x-0' : viewMode === 'preview' ? 'translate-x-full' : 'translate-x-full'
          }`}
        >
          <CompatibilityReport issues={issues} isLoading={isLoading} />
        </div>
      </div>

      <div className="space-y-2 border-t p-2 text-center">
        <div className="bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur" {...swipeHandlers}>
          <div className="flex items-center justify-center gap-1">
            <Button
              size="sm"
              className={cn(viewMode === 'input' && 'flex-1')}
              variant={viewMode === 'input' ? 'default' : 'outline'}
              onClick={() => {
                setViewMode('input');
              }}
            >
              <TextCursorInputIcon className="h-4 w-4" />
              {viewMode === 'input' && 'Input'}
            </Button>
            <Button
              size="sm"
              className={cn(viewMode === 'preview' && 'flex-1')}
              variant={viewMode === 'preview' ? 'default' : 'outline'}
              onClick={() => {
                setViewMode('preview');
              }}
            >
              <FullscreenIcon className="h-4 w-4" />
              {viewMode === 'preview' && 'Preview'}
            </Button>
            <Button
              size="sm"
              className={cn(viewMode === 'report' && 'flex-1')}
              variant={viewMode === 'report' ? 'default' : 'outline'}
              onClick={() => {
                setViewMode('report');
              }}
            >
              <BugIcon className="h-4 w-4" />
              {viewMode === 'report' && 'Editor'}
            </Button>
          </div>
        </div>
        <MobileSwipeHint />
      </div>

      <Footer canIEmailData={canIEmailData} />
    </div>
  );
}
