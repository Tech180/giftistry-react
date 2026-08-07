import React, { useEffect, useRef, useState } from 'react';
import {
  ITEM_PHOTO_ACCEPT,
  ITEM_PHOTO_MAX_COUNT,
  ITEM_PHOTO_MAX_COUNT_ERROR,
} from '../../constants/item-photo-attachment';
import { readItemPhotoFileAsDataUrl } from '../../utils/item-photo-file.util';
import type { ItemPhotoGalleryProps } from './interfaces/item-photo-gallery-props.interface';
import type { ItemPhotoGalleryEntry } from './interfaces/item-photo-gallery-props.interface';
import { ItemPhotoGalleryTemplate } from './item-photo-gallery.html';

function newLocalId(): string {
  return `photo-${crypto.randomUUID()}`;
}

export const ItemPhotoGallery: React.FC<ItemPhotoGalleryProps> = ({
  photos,
  onChange,
  disabled = false,
  errorMsg = null,
  onError,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex >= photos.length) {
      setActiveIndex(Math.max(0, photos.length - 1));
    }
  }, [photos.length, activeIndex]);

  const updateScrollArrows = () => {
    const container = thumbsRef.current;
    if (!container) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }
    const isScrollable = container.scrollWidth > container.clientWidth;
    if (!isScrollable) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }
    setShowLeftArrow(container.scrollLeft > 0);
    const atRightEdge =
      Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth - 1;
    setShowRightArrow(!atRightEdge);
  };

  useEffect(() => {
    const id = window.setTimeout(updateScrollArrows, 50);
    window.addEventListener('resize', updateScrollArrows);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', updateScrollArrows);
    };
  }, [photos.length]);

  const openPicker = () => {
    if (disabled || photos.length >= ITEM_PHOTO_MAX_COUNT) return;
    fileInputRef.current?.click();
  };

  const handleMainAreaClick = () => {
    if (photos.length === 0) openPicker();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    onError?.(null);
    const remaining = ITEM_PHOTO_MAX_COUNT - photos.length;
    if (remaining <= 0) {
      onError?.(ITEM_PHOTO_MAX_COUNT_ERROR);
      return;
    }

    const toProcess = files.slice(0, remaining);
    const next: ItemPhotoGalleryEntry[] = [...photos];

    try {
      for (const file of toProcess) {
        const dataUrl = await readItemPhotoFileAsDataUrl(file);
        next.push({ localId: newLocalId(), dataUrl });
      }
      if (files.length > remaining) {
        onError?.(ITEM_PHOTO_MAX_COUNT_ERROR);
      }
      onChange(next);
      setActiveIndex(next.length - 1);
      window.setTimeout(() => {
        const container = thumbsRef.current;
        if (container) {
          container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
        }
        updateScrollArrows();
      }, 50);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Failed to read image.');
    }
  };

  const handleRemove = (index: number) => {
    const next = photos.filter((_, i) => i !== index);
    onChange(next);
    setActiveIndex((prev) => {
      if (prev >= next.length) return Math.max(0, next.length - 1);
      if (prev > index) return prev - 1;
      return prev;
    });
    onError?.(null);
  };

  const handleDrop = (targetIdx: number) => {
    if (dragIndex === null || dragIndex === targetIdx) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const next = [...photos];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIdx, 0, moved);
    onChange(next);

    setActiveIndex((prev) => {
      if (prev === dragIndex) return targetIdx;
      if (dragIndex < prev && targetIdx >= prev) return prev - 1;
      if (dragIndex > prev && targetIdx <= prev) return prev + 1;
      return prev;
    });

    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <ItemPhotoGalleryTemplate
      photos={photos}
      activeIndex={activeIndex}
      countLabel={`${photos.length} / ${ITEM_PHOTO_MAX_COUNT}`}
      canAdd={photos.length < ITEM_PHOTO_MAX_COUNT}
      disabled={disabled}
      errorMsg={errorMsg}
      fileInputRef={fileInputRef}
      accept={ITEM_PHOTO_ACCEPT}
      onMainAreaClick={handleMainAreaClick}
      onAddClick={openPicker}
      onFileChange={handleFileChange}
      onSelectThumb={setActiveIndex}
      onRemoveThumb={handleRemove}
      onDragStart={setDragIndex}
      onDragOver={(e, idx) => {
        e.preventDefault();
        setDragOverIndex(idx);
      }}
      onDrop={handleDrop}
      onDragEnd={() => {
        setDragIndex(null);
        setDragOverIndex(null);
      }}
      dragIndex={dragIndex}
      dragOverIndex={dragOverIndex}
      thumbsRef={thumbsRef}
      showLeftArrow={showLeftArrow}
      showRightArrow={showRightArrow}
      onScrollLeft={() => {
        thumbsRef.current?.scrollBy({ left: -150, behavior: 'smooth' });
      }}
      onScrollRight={() => {
        thumbsRef.current?.scrollBy({ left: 150, behavior: 'smooth' });
      }}
      onThumbsScroll={updateScrollArrows}
    />
  );
};
