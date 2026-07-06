export interface PreviewProps {
  hoveredUser: { userId: string; displayName: string; rect: DOMRect } | null;
  onClear: () => void;
}
