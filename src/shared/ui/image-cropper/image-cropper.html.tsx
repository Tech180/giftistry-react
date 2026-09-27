import React from 'react';
import { EnterPanel } from '../enter-panel/enter-panel.component';
import { OUTPUT_SIZE, ZOOM_STEP } from './constants/crop.constant';
import styles from './image-cropper.module.css';
import type { ImageCropperTemplateProps } from './interfaces/image-cropper-template-props.interface';

export const ImageCropperTemplate: React.FC<ImageCropperTemplateProps> = ({
  imageSrc,
  title,
  zoom,
  minZoom,
  maxZoom,
  offsetX,
  offsetY,
  isDragging,
  onZoomChange,
  onCropClick,
  onCancelClick,
  onImageLoad,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  imgRef,
  canvasRef,
  cropAreaRef,
  ringRef,
}) => {
  const cropAreaClassName = isDragging
    ? `${styles['crop-area']} ${styles['crop-area--dragging']}`
    : styles['crop-area'];
  const imageClassName = isDragging ? `${styles.image} ${styles['image--dragging']}` : styles.image;

  return (
    <EnterPanel animation="fade" className={styles.overlay}>
      <EnterPanel animation="scale" className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles['close-button']} onClick={onCancelClick} aria-label="Close modal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div
          ref={cropAreaRef}
          className={cropAreaClassName}
          role="img"
          aria-label="Drag to reposition, scroll or pinch to zoom"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt=""
            className={imageClassName}
            draggable={false}
            onLoad={onImageLoad}
            style={{
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
            }}
          />
          <div ref={ringRef} className={styles['crop-ring']} />
        </div>

        <p className={styles.hint}>Drag to move · scroll or pinch to zoom</p>

        <div className={styles.controls}>
          <div className={styles['control-group']}>
            <label className={styles.label} htmlFor="image-cropper-zoom">
              Zoom
            </label>
            <input
              id="image-cropper-zoom"
              type="range"
              min={minZoom}
              max={maxZoom}
              step={ZOOM_STEP}
              value={zoom}
              onChange={onZoomChange}
              className={styles.slider}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles['btn-secondary']}`} onClick={onCancelClick}>
            Cancel
          </button>
          <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={onCropClick}>
            Apply & Save
          </button>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} width={OUTPUT_SIZE} height={OUTPUT_SIZE} />
      </EnterPanel>
    </EnterPanel>
  );
};
