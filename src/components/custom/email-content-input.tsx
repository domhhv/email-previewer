'use client';

import { html } from '@codemirror/lang-html';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import CodeMirror from '@uiw/react-codemirror';
import { BrushCleaningIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { TooltipButton } from '@/components/custom/tooltip-button';
import { Button } from '@/components/ui/button';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DEFAULT_PLACEHOLDER = `<!DOCTYPE html>
<html>
  <head>
    <style>
      .container {
        margin: 0 auto;
        font-family: Arial, sans-serif;
      }
      .header {
        background-color: #46e5e5;
        color: white;
        padding: 20px;
        border-radius: 8px 8px 0 0;
      }
      .content {
        padding: 20px;
        background-color: #ffffff;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #46e5e5;
        color: white;
        text-decoration: none;
        border-radius: 6px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome!</h1>
      </div>
      <div class="content">
        <p>Thanks for signing up. Click below to get started.</p>
        <a href="#" class="button">Get Started</a>
      </div>
    </div>
  </body>
</html>`;

export function EmailContentInput({ onChange, placeholder = 'Paste your HTML email here...', value }: EmailInputProps) {
  const { resolvedTheme } = useTheme();

  const extensions = React.useMemo(() => {
    return [html()];
  }, []);

  const theme = resolvedTheme === 'dark' ? vscodeDark : vscodeLight;

  const fillSample = React.useCallback(() => {
    onChange(DEFAULT_PLACEHOLDER);
  }, [onChange]);

  const clearInput = React.useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <h2>HTML Input</h2>
          {!!value && (
            <TooltipButton size="icon-sm" variant="ghost" onClick={clearInput} tooltip="Clear email input">
              <BrushCleaningIcon className="size-4" />
            </TooltipButton>
          )}
        </div>
        <Button size="sm" variant="secondary" onClick={fillSample}>
          Try Sample
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <CodeMirror
          height="100%"
          value={value}
          theme={theme}
          onChange={onChange}
          extensions={extensions}
          placeholder={placeholder}
          style={{
            fontSize: '13px',
            height: '100%',
          }}
          basicSetup={{
            autocompletion: true,
            bracketMatching: true,
            closeBrackets: true,
            foldGutter: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            indentOnInput: true,
            lineNumbers: true,
          }}
        />
      </div>
    </div>
  );
}
