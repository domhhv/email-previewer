'use client';

import { html } from '@codemirror/lang-html';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import CodeMirror from '@uiw/react-codemirror';
import { BrushCleaningIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { TooltipButton } from '@/components/custom/tooltip-button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { useHasKeyboard } from '@/hooks/use-has-keyboard';
import { useModifierKeys } from '@/hooks/use-modifier-keys';
import { sampleEmailHtml } from '@/lib/sample-email-html';

type EmailInputProps = {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export function EmailContentInput({ onChange, placeholder = 'Paste your HTML email here...', value }: EmailInputProps) {
  const { resolvedTheme } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);
  const { mod, shift } = useModifierKeys();
  const hasKeyboard = useHasKeyboard();

  const extensions = React.useMemo(() => {
    return [html()];
  }, []);

  const theme = resolvedTheme === 'dark' ? vscodeDark : vscodeLight;

  const fillSample = React.useCallback(() => {
    onChange(sampleEmailHtml);
  }, [onChange]);

  const clearInput = React.useCallback(() => {
    onChange('');
  }, [onChange]);

  React.useEffect(() => {
    if (!hasKeyboard) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (
        isFocused &&
        !value.trim() &&
        event.key.toLowerCase() === 'e' &&
        event.getModifierState('Shift') &&
        event.getModifierState('Meta')
      ) {
        event.preventDefault();
        event.stopPropagation();

        fillSample();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocused, value, fillSample, mod, shift, hasKeyboard]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex items-center justify-between border-b px-3 py-2">
        <h2>HTML Input</h2>
        {value.trim() ? (
          <TooltipButton
            size="icon-sm"
            variant="ghost"
            onClick={clearInput}
            tooltip="Clear email input"
            aria-label="Clear email input"
          >
            <BrushCleaningIcon className="size-4" />
          </TooltipButton>
        ) : (
          <TooltipButton
            size="sm"
            variant="default"
            onClick={fillSample}
            tooltip="Fill input with sample email HTML for quick compatibility preview"
            aria-label="Fill input with sample email HTML for quick compatibility preview"
          >
            {isFocused && hasKeyboard && (
              <KbdGroup className="mr-2">
                <Kbd>{mod}</Kbd>
                <Kbd>{shift}</Kbd>
                <Kbd>E</Kbd>
              </KbdGroup>
            )}
            <span>Try Sample</span>
          </TooltipButton>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <CodeMirror
          autoFocus
          height="100%"
          value={value}
          theme={theme}
          onChange={onChange}
          extensions={extensions}
          placeholder={placeholder}
          onFocus={() => {
            return setIsFocused(true);
          }}
          onBlur={() => {
            return setIsFocused(false);
          }}
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
