export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  size?: 'default' | 'sm';
  'aria-label'?: string;
}
