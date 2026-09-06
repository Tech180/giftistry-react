import React from 'react';
import { Download, ImagePlus, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ItemPhotoGalleryTemplateProps } from './interfaces/item-photo-gallery-template-props.interface';
import styles from './item-photo-gallery.module.css';

export const ItemPhotoGalleryTemplate: React.FC<ItemPhotoGalleryTemplateProps> = ({
  photos,
  activeIndex,
  countLabel,
  canAdd,
  disabled,
  errorMsg,
  fileInputRef,
  accept,
  onMainAreaClick,
  onDownloadActive,
  onAddClick,
  onFileChange,
  onSelectThumb,
  onRemoveThumb,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  dragIndex,
  dragOverIndex,
  thumbsRef,
  showLeftArrow,
  showRightArrow,
  onScrollLeft,
  onScrollRight,
  onThumbsScroll,
}) => {
  const activePhoto = photos[activeIndex];
  const hasPhotos = photos.length > 0;

  return (
    <div className={styles['photo-gallery']}>
      <div className={styles['photo-header']}>
        <span className={styles.label}>Item Photos</span>
        <span className={styles['photo-count']}>{countLabel}</span>
      </div>

      <div className={styles['main-photo-frame']}>
        {!hasPhotos ? (
          <button
            type="button"
            className={styles['main-photo-area']}
            title="Click to upload main photo"
            onClick={onMainAreaClick}
            disabled={disabled}
            aria-label="Add photos"
          >
            <div className={styles['main-photo-empty']}>
              <ImagePlus size={28} aria-hidden />
              <span>Add Photos</span>
            </div>
          </button>
        ) : (
          <div
            className={`${styles['main-photo-area']} ${styles['main-photo-filled']}`}
            role="img"
            aria-label="Main item photo"
          >
            <img
              className={styles['main-photo-image']}
              src={activePhoto?.dataUrl}
              alt="Main item photo"
            />
          </div>
        )}

        {hasPhotos && activePhoto?.dataUrl && (
          <button
            type="button"
            className={styles['download-photo-btn']}
            title="Download"
            aria-label="Download photo"
            onClick={(e) => {
              e.stopPropagation();
              onDownloadActive();
            }}
          >
            <Download size={16} aria-hidden />
          </button>
        )}
      </div>

      {hasPhotos && (
        <div className={styles['thumbnails-wrapper']}>
          <button
            type="button"
            className={`${styles['scroll-arrow']} ${styles.left} ${showLeftArrow ? styles.visible : ''}`}
            onClick={onScrollLeft}
            aria-label="Scroll left"
            tabIndex={showLeftArrow ? 0 : -1}
          >
            <ChevronLeft size={16} />
          </button>

          <div
            className={styles['photo-thumbnails']}
            ref={thumbsRef}
            onScroll={onThumbsScroll}
          >
            {photos.map((photo, idx) => (
              <div
                key={photo.localId}
                className={[
                  styles['thumbnail-box'],
                  idx === activeIndex ? styles.active : '',
                  dragIndex === idx ? styles.dragging : '',
                  dragOverIndex === idx ? styles['drag-over'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                draggable={!disabled}
                onClick={() => onSelectThumb(idx)}
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDrop={() => onDrop(idx)}
                onDragEnd={onDragEnd}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectThumb(idx);
                  }
                }}
                aria-label={`Photo ${idx + 1}${idx === activeIndex ? ', selected' : ''}`}
                aria-pressed={idx === activeIndex}
              >
                <img src={photo.dataUrl} alt={`Thumb ${idx + 1}`} />
                {!disabled && (
                  <button
                    type="button"
                    className={styles['thumb-remove-btn']}
                    title="Remove Photo"
                    aria-label={`Remove photo ${idx + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveThumb(idx);
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}

            {canAdd && (
              <button
                type="button"
                className={styles['add-photo-btn']}
                onClick={onAddClick}
                title="Add another photo"
                aria-label="Add another photo"
                disabled={disabled}
              >
                <Plus size={24} />
              </button>
            )}
          </div>

          <button
            type="button"
            className={`${styles['scroll-arrow']} ${styles.right} ${showRightArrow ? styles.visible : ''}`}
            onClick={onScrollRight}
            aria-label="Scroll right"
            tabIndex={showRightArrow ? 0 : -1}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {errorMsg && <p className={styles.error} role="alert">{errorMsg}</p>}

      <input
        ref={fileInputRef}
        type="file"
        className={styles['file-input']}
        accept={accept}
        multiple
        onChange={onFileChange}
        disabled={disabled}
      />
    </div>
  );
};
