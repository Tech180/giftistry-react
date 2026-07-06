import React from 'react';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import styles from './image-cropper.module.css';
import { ImageCropperTemplateProps } from './interfaces/image-cropper-template-props.interface';

export const ImageCropperHtml: React.FC<ImageCropperTemplateProps> = ({
  imageSrc,
  zoom,
  setZoom,
  offsetX,
  setOffsetX,
  offsetY,
  setOffsetY,
  onCropClick,
  onCancelClick,
  imgRef,
  canvasRef,
}) => {
  return (
    <EnterPanel animation="fade" className={styles.overlay}>
      <EnterPanel animation="scale" className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Crop Profile Picture</h3>
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

        <div className={styles['crop-area']}>
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Upload crop preview"
            className={styles.image}
            style={{
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
            }}
          />
          <div className={styles['crop-ring']}></div>
        </div>

        <div className={styles.controls}>
          <div className={styles['control-group']}>
            <label className={styles.label}>Zoom</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles['control-group']}>
            <label className={styles.label}>Move X</label>
            <input
              type="range"
              min="-200"
              max="200"
              step="1"
              value={offsetX}
              onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
              className={styles.slider}
            />
          </div>

          <div className={styles['control-group']}>
            <label className={styles.label}>Move Y</label>
            <input
              type="range"
              min="-200"
              max="200"
              step="1"
              value={offsetY}
              onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
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

        <canvas ref={canvasRef} style={{ display: 'none' }} width={200} height={200} />
      </EnterPanel>
    </EnterPanel>
  );
};
