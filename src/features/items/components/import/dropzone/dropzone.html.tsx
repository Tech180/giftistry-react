import React from 'react';
import { FileUp, Upload } from 'lucide-react';
import { getWishlistImportAccept } from 'features/items/constants/wishlist-import.constants';
import { AiSparklesIcon } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './dropzone.module.css';

export const DropzoneTemplate: React.FC<TemplateProps> = ({
  uploadPercent = 0,
  uploadLabel,
  error,
  allowAi = false,
  children,
  aiGradientId,
  fileInputRef,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onKeyDown,
  onBrowseClick,
  onFileInputChange,
  isMenu,
  showMenuAi,
  interactive,
  className,
  formatsLabel,
  bodyKind,
  formats,
  isDragHighlight,
}) => {
  const menuIconClass = [
    styles['dropzone__menu-icon-wrap'],
    showMenuAi ? styles['dropzone__menu-icon-wrap--ai'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const idleDefault = (
    <>
      <Upload size={28} aria-hidden />
      <p className={styles['dropzone__title']}>Drop your wishlist export here</p>
      <p className={styles['dropzone__hint']}>
        {allowAi ? (
          <span className={styles['dropzone__hint-with-ai']}>
            <span className={styles['dropzone__ai-icon']} aria-hidden>
              <AiSparklesIcon
                gradientId={aiGradientId}
                className={styles['dropzone__ai-icon-svg']}
              />
              <svg width="0" height="0" aria-hidden focusable="false">
                <defs>
                  <linearGradient id={aiGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="50%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--error)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span>
              {formatsLabel} — click to browse
            </span>
          </span>
        ) : (
          <>
            {formatsLabel} — click to browse
          </>
        )}
      </p>
    </>
  );

  const idleMenu = (
    <>
      <span className={menuIconClass} aria-hidden>
        <FileUp size={22} strokeWidth={1.75} />
      </span>
      <p className={styles['dropzone__menu-title']}>Choose a file</p>
      <p className={styles['dropzone__menu-hint']}>Drop here or tap to browse</p>
      <ul className={styles['dropzone__format-chips']} aria-label="Supported formats">
        {formats.map((format) => (
          <li key={format.id} className={styles['dropzone__format-chip']}>
            {format.label}
          </li>
        ))}
      </ul>
    </>
  );

  const uploadingBody = (
    <>
      {isMenu ? (
        <span className={menuIconClass} aria-hidden>
          <Upload size={20} strokeWidth={1.75} />
        </span>
      ) : (
        <Upload size={28} aria-hidden />
      )}
      <p className={isMenu ? styles['dropzone__menu-title'] : styles['dropzone__title']}>
        {uploadLabel || 'Uploading…'}
      </p>
      <div
        className={[
          styles['dropzone__progress-track'],
          isMenu ? styles['dropzone__progress-track--menu'] : '',
        ]
          .filter(Boolean)
          .join(' ')}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={uploadPercent}
        aria-label="Upload progress"
      >
        <div
          className={styles['dropzone__progress-fill']}
          style={{ width: `${Math.max(0, Math.min(100, uploadPercent))}%` }}
        />
      </div>
      <p className={styles['dropzone__percent']}>{uploadPercent}%</p>
    </>
  );

  const body =
    bodyKind === 'ready' ? (
      <>
        {children}
        {error ? <p className={styles['dropzone__error']}>{error}</p> : null}
      </>
    ) : (
      <>
        {bodyKind === 'uploading' ? uploadingBody : bodyKind === 'idle-menu' ? idleMenu : idleDefault}
        {error ? <p className={styles['dropzone__error']}>{error}</p> : null}
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
            <div
              className={[
                styles['dropzone__glow'],
                isDragHighlight ? styles['dropzone__glow--active'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-hidden
            />
            <div className={styles['dropzone__border-wrap']}>
              <div className={styles['dropzone__border-gradient']} aria-hidden />
              <div
                className={[
                  styles['dropzone__inner'],
                  isDragHighlight ? styles['dropzone__inner--active'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {body}
              </div>
            </div>
          </>
        ) : (
          body
        )}
      </div>
      <input
        ref={fileInputRef}
        className={styles['dropzone__hidden-input']}
        type="file"
        accept={getWishlistImportAccept(allowAi)}
        onChange={onFileInputChange}
        tabIndex={-1}
      />
    </>
  );
};
