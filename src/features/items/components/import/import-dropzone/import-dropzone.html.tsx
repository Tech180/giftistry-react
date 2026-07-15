import React from 'react';
import { Upload } from 'lucide-react';
import { WISHLIST_IMPORT_ACCEPT } from 'features/items/constants/wishlist-import.constants';
import type { ImportDropzoneTemplateProps } from './interfaces/import-dropzone-template-props.interface';
import styles from './import-dropzone.module.css';

export const ImportDropzoneTemplate: React.FC<ImportDropzoneTemplateProps> = ({
  disabled,
  status = 'idle',
  uploadPercent = 0,
  uploadLabel,
  error,
  children,
  isDragActive,
  fileInputRef,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onKeyDown,
  onBrowseClick,
  onFileInputChange,
}) => {
  const isReady = status === 'ready' || status === 'error';
  const isUploading = status === 'uploading';
  const interactive = !disabled && !isUploading && !isReady;
  const className = [
    styles.dropzone,
    isReady ? styles.dropzoneReady : '',
    isDragActive && interactive ? styles.dropzoneActive : '',
    (disabled || isUploading) && !isReady ? styles.dropzoneDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        className={className}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : -1}
        aria-label={
          interactive
            ? 'Drop a wishlist export file here, or press Enter to browse'
            : undefined
        }
        aria-disabled={!interactive}
        onDragEnter={interactive ? onDragEnter : undefined}
        onDragOver={interactive ? onDragOver : undefined}
        onDragLeave={interactive ? onDragLeave : undefined}
        onDrop={interactive ? onDrop : undefined}
        onKeyDown={interactive ? onKeyDown : undefined}
        onClick={interactive ? onBrowseClick : undefined}
      >
        {isReady ? (
          <>
            {children}
            {error ? <p className={styles.error}>{error}</p> : null}
          </>
        ) : (
          <>
            <Upload size={28} aria-hidden />
            {isUploading ? (
              <>
                <p className={styles.title}>{uploadLabel || 'Uploading…'}</p>
                <div
                  className={styles.progressTrack}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={uploadPercent}
                  aria-label="Upload progress"
                >
                  <div
                    className={styles.progressFill}
                    style={{ width: `${Math.max(0, Math.min(100, uploadPercent))}%` }}
                  />
                </div>
                <p className={styles.percent}>{uploadPercent}%</p>
              </>
            ) : (
              <>
                <p className={styles.title}>Drop your wishlist export here</p>
                <p className={styles.hint}>CSV, XLSX, TXT, JSON, or PDF — click to browse</p>
              </>
            )}
            {error ? <p className={styles.error}>{error}</p> : null}
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        className={styles.hiddenInput}
        type="file"
        accept={WISHLIST_IMPORT_ACCEPT}
        onChange={onFileInputChange}
        tabIndex={-1}
      />
    </>
  );
};
