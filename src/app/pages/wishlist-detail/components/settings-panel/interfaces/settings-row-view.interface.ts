import type { ReactNode } from 'react';

export interface SettingsRowView {
  key: string;
  label: string;
  checked: boolean;
  readOnly: boolean;
  icon: ReactNode;
  iconClassName: string;
  rowClassName: string;
  metaClassName: string;
  meta: string;
  ariaLabel: string;
  switchAriaLabel: string;
  onToggle: () => void;
}
