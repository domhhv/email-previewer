import type { Ref, ReactNode, ComponentProps } from 'react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type TooltipButtonProps = {
  children: ReactNode;
  delayDuration?: number;
  ref?: Ref<HTMLButtonElement>;
  tooltip: string;
  onClick: () => void;
  onMouseEnter?: () => void;
} & Pick<ComponentProps<typeof Button>, 'variant' | 'size' | 'disabled' | 'aria-label'>;

export function TooltipButton({
  'aria-label': ariaLabel = '',
  children,
  delayDuration = 500,
  disabled = false,
  onClick,
  onMouseEnter,
  ref,
  size = 'icon',
  tooltip,
  variant = 'ghost',
}: TooltipButtonProps) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild onMouseEnter={onMouseEnter}>
        <Button ref={ref} size={size} variant={variant} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2 p-2 pr-2.5">{tooltip}</TooltipContent>
    </Tooltip>
  );
}
