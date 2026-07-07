import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface SensitiveGateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  unlockLabel?: string;
  onUnlock?: () => void;
  children: ReactNode;
}
