import React from 'react';
import type { GifItem } from '../../../../../../interfaces/gif-item.interface';

export interface GifTemplateProps {
  isOpen: boolean;
  onToggle: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  gifQuery: string;
  setGifQuery: (query: string) => void;
  gifs: GifItem[];
  isLoadingGifs: boolean;
  isSelectingGif: boolean;
  onSelectGif: (url: string) => void;
}
