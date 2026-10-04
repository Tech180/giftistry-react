import { useLayoutEffect, useState } from 'react';
import { computeAnchoredPopoverPosition } from '../utils/compute-anchored-popover-position.util';
import type { AnchoredPopoverPosition } from './interfaces/anchored-popover-position.interface';
import type { UseAnchoredPopoverOptions } from './interfaces/use-anchored-popover-options.interface';

export function useAnchoredPopover(
  anchorRef: React.RefObject<HTMLElement | null>,
  popoverRef: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
  options: UseAnchoredPopoverOptions = {}
): AnchoredPopoverPosition {
  const {
    estimatedHeight = 320,
    estimatedWidth = 300,
    gap = 8,
    viewportPadding = 12,
  } = options;

  const [placement, setPlacement] = useState<AnchoredPopoverPosition['placement']>('above');
  const [style, setStyle] = useState<React.CSSProperties>({
    top: 0,
    left: 0,
    visibility: 'hidden',
  });

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) {
        return;
      }

      const rect = anchor.getBoundingClientRect();
      const popoverHeight = popoverRef.current?.offsetHeight ?? estimatedHeight;
      const popoverWidth = popoverRef.current?.offsetWidth ?? estimatedWidth;

      const result = computeAnchoredPopoverPosition({
        anchorRect: rect,
        popoverWidth,
        popoverHeight,
        gap,
        viewportPadding,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });

      setPlacement(result.placement);
      setStyle({
        top: `${result.top}px`,
        left: `${result.left}px`,
        visibility: 'visible',
        ...(result.constrainMaxHeight
          ? { maxHeight: `${result.maxHeight}px` }
          : {}),
      });
    };

    updatePosition();

    const popoverEl = popoverRef.current;
    let resizeObserver: ResizeObserver | null = null;
    if (popoverEl && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updatePosition();
      });
      resizeObserver.observe(popoverEl);
    }

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorRef, estimatedHeight, estimatedWidth, gap, isOpen, popoverRef, viewportPadding]);

  return { placement, style };
}
