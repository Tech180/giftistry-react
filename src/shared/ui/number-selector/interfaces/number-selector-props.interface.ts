export interface NumberSelectorProps {
  value: number;
  min?: number;
  /** When omitted, the value can increase without an upper bound. */
  max?: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  decreaseLabel?: string;
  increaseLabel?: string;
  size?: 'sm' | 'md';
  className?: string;
  /** Click the value to type a custom number. Defaults to true. */
  editable?: boolean;
  /** When value is 0, show an infinity icon instead of "0". */
  zeroAsInfinity?: boolean;
}
