import { useLayoutEffect, useState } from 'react';

export type PopoverPlacement = 'above' | 'below';

export interface UseAnchoredPopoverOptions {
  estimatedHeight?: number;
  estimatedWidth?: number;
  gap?: number;
  viewportPadding?: number;
}

export interface AnchoredPopoverPosition {
  placement: PopoverPlacement;
  style: React.CSSProperties;
}

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

  const [placement, setPlacement] = useState<PopoverPlacement>('above');
  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 10000,
    visibility: 'hidden',
  });

  useLayoutEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const popoverHeight = popoverRef.current?.offsetHeight ?? estimatedHeight;
      const popoverWidth = popoverRef.current?.offsetWidth ?? estimatedWidth;

      const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
      const spaceAbove = rect.top - viewportPadding;
      const nextPlacement: PopoverPlacement =
        spaceBelow >= popoverHeight + gap || spaceBelow >= spaceAbove ? 'below' : 'above';

      let top =
        nextPlacement === 'below'
          ? rect.bottom + gap
          : rect.top - popoverHeight - gap;

      let left = rect.left;

      if (left + popoverWidth > window.innerWidth - viewportPadding) {
        left = window.innerWidth - popoverWidth - viewportPadding;
      }
      if (left < viewportPadding) {
        left = viewportPadding;
      }

      if (top + popoverHeight > window.innerHeight - viewportPadding) {
        top = window.innerHeight - popoverHeight - viewportPadding;
      }
      if (top < viewportPadding) {
        top = viewportPadding;
      }

      setPlacement(nextPlacement);
      setStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 10000,
        visibility: 'visible',
      });
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorRef, estimatedHeight, estimatedWidth, gap, isOpen, popoverRef, viewportPadding]);

  return { placement, style };
}
