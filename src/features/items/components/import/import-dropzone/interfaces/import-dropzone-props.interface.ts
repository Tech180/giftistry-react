import type { ReactNode } from 'react';

export type ImportDropzoneStatus = 'idle' | 'uploading' | 'ready' | 'error';

export interface ImportDropzoneProps {
  disabled?: boolean;
  status?: ImportDropzoneStatus;
  uploadPercent?: number;
  uploadLabel?: string;
  fileName?: string | null;
  error?: string | null;
  onFileSelected: (file: File) => void;
  children?: ReactNode;
}
