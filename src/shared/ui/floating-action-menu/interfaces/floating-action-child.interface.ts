import type { ReactNode } from 'react';

export interface FloatingActionChild {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}
