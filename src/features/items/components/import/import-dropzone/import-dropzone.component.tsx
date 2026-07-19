import React, { useRef, useState } from 'react';
import type { ImportDropzoneProps } from './interfaces/import-dropzone-props.interface';
import { ImportDropzoneTemplate } from './import-dropzone.html';

export const ImportDropzone: React.FC<ImportDropzoneProps> = ({
  disabled,
  status = 'idle',
  uploadPercent,
  uploadLabel,
  fileName,
  error,
  allowAi = false,
  variant = 'default',
  onFileSelected,
  children,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const dragDepthRef = useRef(0);
  const interactive = !disabled && status === 'idle';

  const openBrowser = () => {
    if (!interactive) return;
    fileInputRef.current?.click();
  };

  const handleFile = (file: File | undefined | null) => {
    if (!file || !interactive) return;
    onFileSelected(file);
  };

  return (
    <ImportDropzoneTemplate
      disabled={disabled}
      status={status}
      uploadPercent={uploadPercent}
      uploadLabel={uploadLabel}
      fileName={fileName}
      error={error}
      allowAi={allowAi}
      variant={variant}
      children={children}
      onFileSelected={onFileSelected}
      isDragActive={isDragActive}
      fileInputRef={fileInputRef}
      onDragEnter={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepthRef.current += 1;
        setIsDragActive(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
        if (dragDepthRef.current === 0) {
          setIsDragActive(false);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepthRef.current = 0;
        setIsDragActive(false);
        handleFile(event.dataTransfer.files?.[0]);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openBrowser();
        }
      }}
      onBrowseClick={openBrowser}
      onFileInputChange={(event) => {
        handleFile(event.target.files?.[0]);
        event.target.value = '';
      }}
    />
  );
};
