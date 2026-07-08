export interface SwitchTemplateProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  size?: 'default' | 'sm';
  ariaLabel?: string;
}
