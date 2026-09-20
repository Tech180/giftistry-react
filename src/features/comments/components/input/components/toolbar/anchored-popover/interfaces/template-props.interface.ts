import type { PopoverPlacement } from '../../../../../../hooks/interfaces/popover-placement.type';

export interface TemplateProps {
  popoverRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  style: React.CSSProperties;
  placement: PopoverPlacement;
  children: React.ReactNode;
}
