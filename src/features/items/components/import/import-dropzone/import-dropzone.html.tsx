import React, { useId } from 'react';
import { FileUp, Upload } from 'lucide-react';
import {
  getWishlistImportAccept,
  getWishlistImportFormatOptions,
} from 'features/items/constants/wishlist-import.constants';
import { AiSparklesIcon } from 'shared/ui/badge/icons/ai-badge-icons';
import type { ImportDropzoneTemplateProps } from './interfaces/import-dropzone-template-props.interface';
import styles from './import-dropzone.module.css';

export const ImportDropzoneTemplate: React.FC<ImportDropzoneTemplateProps> = ({
  disabled,
  status = 'idle',
  uploadPercent = 0,
  uploadLabel,
  error,
  allowAi = false,
  variant = 'default',
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
  const aiGradientId = `import-dropzone-ai-gradient-${useId().replace(/:/g, '')}`;
  const isReady = status === 'ready' || status === 'error';
  const isUploading = status === 'uploading';
  const interactive = !disabled && !isUploading && !isReady;
  const isMenu = variant === 'menu';
  const showMenuAi = isMenu && allowAi && !isReady;

  const className = [
    styles.dropzone,
    isMenu ? styles.dropzoneMenu : '',
    showMenuAi ? styles.dropzoneMenuAi : '',
    isReady ? styles.dropzoneReady : '',
    isDragActive && interactive ? styles.dropzoneActive : '',
    (disabled || isUploading) && !isReady ? styles.dropzoneDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const formats = getWishlistImportFormatOptions(allowAi);

  const idleDefault = (
    <>
      <Upload size={28} aria-hidden />
      <p className={styles.title}>Drop your wishlist export here</p>
      <p className={styles.hint}>
        {allowAi ? (
          <span className={styles.hintWithAi}>
            <span className={styles.aiIcon} aria-hidden>
              <AiSparklesIcon gradientId={aiGradientId} />
              <svg width="0" height="0" aria-hidden focusable="false">
                <defs>
                  <linearGradient id={aiGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5E42F8" />
                    <stop offset="50%" stopColor="#B656CB" />
                    <stop offset="100%" stopColor="#F15565" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span>
              {formats.map((f) => f.label).join(', ').replace(/, ([^,]*)$/, ', or $1')} — click to
              browse
            </span>
          </span>
        ) : (
          <>
            {formats.map((f) => f.label).join(', ').replace(/, ([^,]*)$/, ', or $1')} — click to
            browse
          </>
        )}
      </p>
    </>
  );

  const idleMenu = (
    <>
      <span className={styles.menuIconWrap} aria-hidden>
        <FileUp size={22} strokeWidth={1.75} />
      </span>
      <p className={styles.menuTitle}>Choose a file</p>
      <p className={styles.menuHint}>Drop here or tap to browse</p>
      <ul className={styles.formatChips} aria-label="Supported formats">
        {formats.map((format) => (
          <li key={format.id} className={styles.formatChip}>
            {format.label}
          </li>
        ))}
      </ul>
    </>
  );

  const uploadingBody = (
    <>
      {isMenu ? (
        <span className={styles.menuIconWrap} aria-hidden>
          <Upload size={20} strokeWidth={1.75} />
        </span>
      ) : (
        <Upload size={28} aria-hidden />
      )}
      <p className={isMenu ? styles.menuTitle : styles.title}>
        {uploadLabel || 'Uploading…'}
      </p>
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
  );

  const body = isReady ? (
    <>
      {children}
      {error ? <p className={styles.error}>{error}</p> : null}
    </>
  ) : (
    <>
      {isUploading ? uploadingBody : isMenu ? idleMenu : idleDefault}
      {error ? <p className={styles.error}>{error}</p> : null}
    </>
  );

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
        {showMenuAi ? (
          <>
            <div className={styles.menuGlow} aria-hidden />
            <div className={styles.menuBorderWrap}>
              <div className={styles.menuBorderGradient} aria-hidden />
              <div className={styles.menuInner}>{body}</div>
            </div>
          </>
        ) : (
          body
        )}
      </div>
      <input
        ref={fileInputRef}
        className={styles.hiddenInput}
        type="file"
        accept={getWishlistImportAccept(allowAi)}
        onChange={onFileInputChange}
        tabIndex={-1}
      />
    </>
  );
};
