import type { ReactNode, RefObject, DragEvent, KeyboardEvent, ChangeEvent } from 'react';
import type { BodyKind } from './body-kind.type';

export interface FormatOption {
  id: string;
  label: string;
}

export interface TemplateProps {
  uploadPercent: number;
  uploadLabel?: string;
  error?: string | null;
  allowAi: boolean;
  children?: ReactNode;
  aiGradientId: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onBrowseClick: () => void;
  onFileInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isMenu: boolean;
  showMenuAi: boolean;
  interactive: boolean;
  className: string;
  formatsLabel: string;
  bodyKind: BodyKind;
  formats: FormatOption[];
  isDragHighlight: boolean;
}
