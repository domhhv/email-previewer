'use client';

import { TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { EMAIL_CLIENTS, type EmailClient, transformForClient } from '@/lib/email-client-transforms';
import { cn } from '@/lib/utils';

type EmailPreviewProps = {
  html: string;
};

export function EmailContentPreview({ html }: EmailPreviewProps) {
  const [selectedClient, setSelectedClient] = React.useState<EmailClient>('browser');

  const normalizedHtml = React.useMemo(() => {
    if (!html.trim()) {
      return `
        <html>
          <body style="display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: system-ui, sans-serif; color: #71717a;">
            <p>Enter HTML to see preview</p>
          </body>
        </html>
      `;
    }

    // Apply client-specific transformations
    const transformed = transformForClient(html, selectedClient);

    const isWrappedInHtmlTag =
      transformed.toLowerCase().includes('<!doctype') || transformed.toLowerCase().includes('<html');

    if (isWrappedInHtmlTag) {
      return transformed;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          ${transformed}
        </body>
      </html>
    `;
  }, [html, selectedClient]);

  const selectedClientInfo = EMAIL_CLIENTS.find((c) => {
    return c.id === selectedClient;
  });

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex items-center justify-between gap-2 border-b px-4 py-2">
        <h2 className="shrink-0">Preview</h2>
        <div className="flex items-center gap-1">
          {EMAIL_CLIENTS.map((client) => {
            return (
              <Button
                size="sm"
                key={client.id}
                variant={selectedClient === client.id ? 'secondary' : 'ghost'}
                className={cn('h-7 px-2 text-xs', selectedClient === client.id && 'font-medium')}
                onClick={() => {
                  setSelectedClient(client.id);
                }}
              >
                {client.label}
              </Button>
            );
          })}
        </div>
      </div>

      {selectedClient !== 'browser' && (
        <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0" />
          <div>
            <span className="font-medium">Simulated view:</span> {selectedClientInfo?.description} This is an
            approximation—actual rendering may differ. For pixel-perfect testing, use{' '}
            <Link
              target="_blank"
              href="https://litmus.com"
              rel="noopener noreferrer"
              className="font-medium underline hover:no-underline"
            >
              Litmus
            </Link>{' '}
            or{' '}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.emailonacid.com"
              className="font-medium underline hover:no-underline"
            >
              Email on Acid
            </Link>
            .
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden bg-slate-100 p-4 dark:bg-slate-800">
        <div className="mx-auto h-full max-w-[640px] overflow-auto rounded-lg bg-white shadow-lg">
          <iframe
            title="Email Preview"
            srcDoc={normalizedHtml}
            sandbox="allow-same-origin"
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
