import type { CollapsibleStripStatus } from 'shared/ui';
import type { Mode } from './mode.type';

export interface BuildStatusOptions {
  wishlistTitle: string;
  errorMessage: string | null;
  mode: Mode;
  uploadPercent: number;
  successMessage?: string | null;
  successTone?: CollapsibleStripStatus['tone'];
}
