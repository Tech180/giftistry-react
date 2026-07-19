import type { ReactNode } from 'react';

export type ImportDropzoneStatus = 'idle' | 'uploading' | 'ready' | 'error';

export type ImportDropzoneVariant = 'default' | 'menu';

export interface ImportDropzoneProps {
  disabled?: boolean;
  status?: ImportDropzoneStatus;
  uploadPercent?: number;
  uploadLabel?: string;
  fileName?: string | null;
  error?: string | null;
  /** When true, PDF is accepted and an AI affordance is shown in the hint. */
  allowAi?: boolean;
  /**
   * `menu` is a compact layout for the floating action panel.
   * `default` is the full strip dropzone.
   */
  variant?: ImportDropzoneVariant;
  onFileSelected: (file: File) => void;
  children?: ReactNode;
}
