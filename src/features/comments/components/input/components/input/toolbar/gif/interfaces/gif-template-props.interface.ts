import React from 'react';
import { GifItem } from '../../../../../../../utils/gif-fetcher.util';

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
