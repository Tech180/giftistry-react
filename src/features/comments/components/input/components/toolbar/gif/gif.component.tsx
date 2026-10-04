import React, { useEffect, useState } from 'react';
import type { GifItem } from '../../../../../interfaces/gif-item.interface';
import { ApiError } from 'core/api/api-error';
import { gifsApi } from '../../../../../api/gifs.api';
import {
  GIF_SEARCH_GENERIC_ERROR_MESSAGE,
  GIF_SEARCH_NOT_CONFIGURED_MESSAGE,
  GIF_SEARCH_UPSTREAM_ERROR_MESSAGE,
} from '../../../../../constants/gif-search-messages.constant';
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
  const [searchHint, setSearchHint] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadGifs = async () => {
      setIsLoadingGifs(true);
      setSearchHint(null);
      try {
        const results = await gifsApi.search(gifQuery);
        setGifs(results);
        if (results.length === 0) {
          setSearchHint('No GIFs found.');
        }
      } catch (err) {
        console.error('Error fetching GIFs:', err);
        setGifs([]);
        if (err instanceof ApiError) {
          if (err.status === 503) {
            setSearchHint(GIF_SEARCH_NOT_CONFIGURED_MESSAGE);
          } else if (err.status === 502) {
            setSearchHint(GIF_SEARCH_UPSTREAM_ERROR_MESSAGE);
          } else if (err.status === 429) {
            setSearchHint('Too many GIF searches. Please wait a moment.');
          } else {
            setSearchHint(err.message || GIF_SEARCH_GENERIC_ERROR_MESSAGE);
          }
        } else {
          setSearchHint(GIF_SEARCH_GENERIC_ERROR_MESSAGE);
        }
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
      const dataUrl = await gifsApi.importFromUrl(gifUrl);
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
      searchHint={searchHint}
      onSelectGif={handleSelectGif}
    />
  );
};
