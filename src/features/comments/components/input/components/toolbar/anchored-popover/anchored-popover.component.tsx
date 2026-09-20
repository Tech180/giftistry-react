import React from 'react';
import ReactDOM from 'react-dom';
import { useAnchoredPopover } from '../../../../../hooks/use-anchored-popover';
import type { Props } from './interfaces/props.interface';
import { AnchoredPopoverTemplate } from './anchored-popover.html';

export const AnchoredPopover: React.FC<Props> = ({
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

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <AnchoredPopoverTemplate
      popoverRef = {
        popoverRef
      }
      className = {
        className
      }
      style = {
        style
      }
      placement = {
        placement
      }
    >
      {
        children
      }
    </AnchoredPopoverTemplate>,
    document.body
  );
};
