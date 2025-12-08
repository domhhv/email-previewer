'use client';

import * as React from 'react';

interface EmailPreviewProps {
  html: string;
}

export function EmailContentPreview({ html }: EmailPreviewProps) {
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

    const isWrappedInHtmlTag = html.toLowerCase().includes('<!doctype') || html.toLowerCase().includes('<html');

    if (isWrappedInHtmlTag) {
      return html;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
  }, [html]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <h2>Live Preview</h2>
        <span className="text-sm">Browser rendering</span>
      </div>
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
