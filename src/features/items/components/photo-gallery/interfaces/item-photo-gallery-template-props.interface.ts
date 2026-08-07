import type { ItemPhotoGalleryEntry } from './item-photo-gallery-props.interface';

export interface ItemPhotoGalleryTemplateProps {
  photos: ItemPhotoGalleryEntry[];
  activeIndex: number;
  countLabel: string;
  canAdd: boolean;
  disabled: boolean;
  errorMsg: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  onMainAreaClick: () => void;
  onAddClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectThumb: (index: number) => void;
  onRemoveThumb: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
  dragIndex: number | null;
  dragOverIndex: number | null;
  thumbsRef: React.RefObject<HTMLDivElement | null>;
  showLeftArrow: boolean;
  showRightArrow: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  onThumbsScroll: () => void;
}
