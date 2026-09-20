export interface GifProps {
  isOpen: boolean;
  onToggle: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  setImageUrl?: (url: string | null) => void;
  onError?: (message: string | null) => void;
}
