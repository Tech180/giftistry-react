export interface NumberSelectorProps {
  value: number;
  min?: number;
  max: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  decreaseLabel?: string;
  increaseLabel?: string;
  size?: 'sm' | 'md';
  className?: string;
}
