import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface SensitiveGateTemplateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  unlockLabel: string;
  isLocked: boolean;
  onUnlock: () => void;
  children: ReactNode;
}
