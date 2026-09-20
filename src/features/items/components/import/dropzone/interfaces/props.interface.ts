import type { ReactNode } from 'react';

export type Status = 'idle' | 'uploading' | 'ready' | 'error';

export type Variant = 'default' | 'menu';

export interface Props {
  disabled?: boolean;
  status?: Status;
  uploadPercent?: number;
  uploadLabel?: string;
  error?: string | null;
  /** When true, PDF is accepted and an AI affordance is shown in the hint. */
  allowAi?: boolean;
  /**
   * `menu` is a compact layout for the floating action panel.
   * `default` is the full strip dropzone.
   */
  variant?: Variant;
  onFileSelected: (file: File) => void;
  children?: ReactNode;
}
