import type { ChangeEvent, PointerEvent, RefObject, SyntheticEvent } from 'react';

export interface ImageCropperTemplateProps {
  imageSrc: string;
  title: string;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
  onZoomChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCropClick: () => void;
  onCancelClick: () => void;
  onImageLoad: (event: SyntheticEvent<HTMLImageElement>) => void;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
  imgRef: RefObject<HTMLImageElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cropAreaRef: RefObject<HTMLDivElement | null>;
  ringRef: RefObject<HTMLDivElement | null>;
}
