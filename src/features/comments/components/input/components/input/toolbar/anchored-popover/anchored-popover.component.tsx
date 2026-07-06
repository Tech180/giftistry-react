import React from 'react';
import ReactDOM from 'react-dom';
import { useAnchoredPopover, UseAnchoredPopoverOptions } from '../../../../../../hooks/use-anchored-popover';

export interface AnchoredPopoverProps extends UseAnchoredPopoverOptions {
  anchorRef: React.RefObject<HTMLElement | null>;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  className?: string;
  children: React.ReactNode;
}

export const AnchoredPopover: React.FC<AnchoredPopoverProps> = ({
  anchorRef,
  popoverRef,
  isOpen,
  className,
  children,
  estimatedHeight,
  estimatedWidth,
  gap,
  viewportPadding,
}) => {
  const { placement, style } = useAnchoredPopover(anchorRef, popoverRef, isOpen, {
    estimatedHeight,
    estimatedWidth,
    gap,
    viewportPadding,
  });

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div ref={popoverRef} className={className} style={style} data-placement={placement}>
      {children}
    </div>,
    document.body
  );
};
