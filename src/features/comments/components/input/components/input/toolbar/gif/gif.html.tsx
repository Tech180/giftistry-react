import React from 'react';
import { GifTemplateProps } from './interfaces/gif-template-props.interface';
import { AnchoredPopover } from '../anchored-popover/anchored-popover.component';
import styles from './gif.module.css';

export const GifTemplate: React.FC<GifTemplateProps> = ({
  isOpen,
  onToggle,
  anchorRef,
  popoverRef,
  gifQuery,
  setGifQuery,
  gifs,
  isLoadingGifs,
  isSelectingGif,
  onSelectGif,
}) => (
  <div ref={anchorRef} className={styles['picker-anchor']}>
    <button
      type="button"
      onClick={onToggle}
      className={`${styles['chat-tool-btn']} ${isOpen ? styles.active : ''}`}
      title="Add GIF"
      disabled={isSelectingGif}
    >
      <span className={styles['gif-icon-text']}>GIF</span>
    </button>
    <AnchoredPopover
      anchorRef={anchorRef}
      popoverRef={popoverRef}
      isOpen={isOpen}
      className={styles['gif-picker-dropdown']}
      estimatedHeight={300}
      estimatedWidth={300}
    >
      <input
        type="text"
        className={styles['gif-search-input']}
        placeholder="Search GIFs on GIPHY..."
        value={gifQuery}
        onChange={(e) => setGifQuery(e.target.value)}
        disabled={isSelectingGif}
      />
      <div className={styles['gif-results-container']}>
        {isLoadingGifs || isSelectingGif ? (
          <div className={styles['gif-loading-container']}>
            <div className={styles.spinner} />
            {isSelectingGif && <span className={styles['gif-loading-text']}>Adding GIF...</span>}
          </div>
        ) : gifs.length > 0 ? (
          <div className={styles['gif-results']}>
            {gifs.map((gif) => (
              <button
                key={gif.id}
                type="button"
                className={styles['gif-result-btn']}
                onClick={() => onSelectGif(gif.originalUrl)}
                disabled={isSelectingGif}
              >
                <img src={gif.url} alt={gif.title} className={styles['gif-result-img']} />
              </button>
            ))}
          </div>
        ) : (
          <div className={styles['gif-no-results']}>No GIFs found</div>
        )}
      </div>
    </AnchoredPopover>
  </div>
);
