import React, { useId, useRef, useState } from 'react';
import { getWishlistImportFormatOptions } from 'features/items/constants/wishlist-import.constants';
import type { Props } from './interfaces/props.interface';
import type { BodyKind } from './interfaces/body-kind.type';
import { DropzoneTemplate } from './dropzone.html';
import styles from './dropzone.module.css';

export const Dropzone: React.FC<Props> = ({
  disabled,
  status = 'idle',
  uploadPercent = 0,
  uploadLabel,
  error,
  allowAi = false,
  variant = 'default',
  onFileSelected,
  children,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const dragDepthRef = useRef(0);
  const aiGradientId = `import-dropzone-ai-gradient-${useId().replace(/:/g, '')}`;

  const isReady = status === 'ready' || status === 'error';
  const isUploading = status === 'uploading';
  const interactive = !disabled && !isUploading && !isReady;
  const isMenu = variant === 'menu';
  const showMenuAi = isMenu && allowAi && !isReady;
  const isDragHighlight = isDragActive && interactive;

  const className = [
    styles['dropzone'],
    isMenu ? styles['dropzone--menu'] : '',
    showMenuAi ? styles['dropzone--menu-ai'] : '',
    isReady ? styles['dropzone--ready'] : '',
    isDragHighlight ? styles['dropzone--active'] : '',
    isMenu && isDragHighlight && !showMenuAi ? styles['dropzone--menu-active'] : '',
    (disabled || isUploading) && !isReady ? styles['dropzone--disabled'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const formats = getWishlistImportFormatOptions(allowAi);
  const formatsLabel = formats.map((f) => f.label).join(', ').replace(/, ([^,]*)$/, ', or $1');

  let bodyKind: BodyKind = 'idle-default';
  if (isReady) {
    bodyKind = 'ready';
  } else if (isUploading) {
    bodyKind = 'uploading';
  } else if (isMenu) {
    bodyKind = 'idle-menu';
  }

  const openBrowser = () => {
    if (!interactive) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFile = (file: File | undefined | null) => {
    if (!file || !interactive) {
      return;
    }
    onFileSelected(file);
  };

  return (
    <DropzoneTemplate
      uploadPercent = { uploadPercent }
      uploadLabel = { uploadLabel }
      error = { error }
      allowAi = { allowAi }
      children = { children }
      aiGradientId = { aiGradientId }
      fileInputRef = { fileInputRef }
      onDragEnter = { (event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepthRef.current += 1;
        setIsDragActive(true);
      } }
      onDragOver = { (event) => {
        event.preventDefault();
        event.stopPropagation();
      } }
      onDragLeave = { (event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
        if (dragDepthRef.current === 0) {
          setIsDragActive(false);
        }
      } }
      onDrop = { (event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepthRef.current = 0;
        setIsDragActive(false);
        handleFile(event.dataTransfer.files?.[0]);
      } }
      onKeyDown = { (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openBrowser();
        }
      } }
      onBrowseClick = { openBrowser }
      onFileInputChange = { (event) => {
        handleFile(event.target.files?.[0]);
        event.target.value = '';
      } }
      isMenu = { isMenu }
      showMenuAi = { showMenuAi }
      interactive = { interactive }
      className = { className }
      formatsLabel = { formatsLabel }
      bodyKind = { bodyKind }
      formats = { formats }
      isDragHighlight = { isDragHighlight }
    />
  );
};
