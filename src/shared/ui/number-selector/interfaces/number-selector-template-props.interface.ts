export interface NumberSelectorTemplateProps {
  value: number;
  disabled: boolean;
  decreaseDisabled: boolean;
  increaseDisabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseLabel: string;
  increaseLabel: string;
  size: 'sm' | 'md';
  className: string;
}
