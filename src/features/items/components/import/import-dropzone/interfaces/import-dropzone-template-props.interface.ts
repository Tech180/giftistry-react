import type { ImportDropzoneProps } from './import-dropzone-props.interface';

export interface ImportDropzoneTemplateProps extends ImportDropzoneProps {
  isDragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onBrowseClick: () => void;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
