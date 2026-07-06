import React, { useEffect, useState } from 'react';
import { fetchGifs as apiFetchGifs, GifItem } from '../../../../../../utils/gif-fetcher.util';
import { remoteImageUrlToDataUrl } from '../../../../../../utils/comment-image-url.util';
import { GifProps } from './interfaces/gif-props.interface';
import { GifTemplate } from './gif.html';

export const GifPickerButton: React.FC<GifProps> = ({
  isOpen,
  onToggle,
  anchorRef,
  popoverRef,
  setImageUrl,
  onError,
}) => {
  const [gifQuery, setGifQuery] = useState('');
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const [isSelectingGif, setIsSelectingGif] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadGifs = async () => {
      setIsLoadingGifs(true);
      try {
        const results = await apiFetchGifs(gifQuery);
        setGifs(results);
      } catch (err) {
        console.error('Error fetching GIFs:', err);
      } finally {
        setIsLoadingGifs(false);
      }
    };

    loadGifs();
  }, [isOpen, gifQuery]);

  const handleSelectGif = async (gifUrl: string) => {
    if (isSelectingGif) return;

    setIsSelectingGif(true);
    onError?.(null);

    try {
      const dataUrl = await remoteImageUrlToDataUrl(gifUrl);
      setImageUrl?.(dataUrl);
      if (isOpen) onToggle();
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Failed to load GIF.');
    } finally {
      setIsSelectingGif(false);
    }
  };

  return (
    <GifTemplate
      isOpen={isOpen}
      onToggle={onToggle}
      anchorRef={anchorRef}
      popoverRef={popoverRef}
      gifQuery={gifQuery}
      setGifQuery={setGifQuery}
      gifs={gifs}
      isLoadingGifs={isLoadingGifs}
      isSelectingGif={isSelectingGif}
      onSelectGif={handleSelectGif}
    />
  );
};
