import type { Variant } from './variant.type';

export interface Props {
  priority: number;
  variant?: Variant;
  showHint?: boolean;
  className?: string;
}
