export interface PriorityDisplayProps {
  priority: number;
  variant?: 'stacked' | 'rail' | 'rail-right' | 'chip' | 'badge' | 'meta' | 'compact';
  showHint?: boolean;
  className?: string;
}
