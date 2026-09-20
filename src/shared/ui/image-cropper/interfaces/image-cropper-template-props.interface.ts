import type { ChangeEvent, RefObject } from 'react';

export interface ImageCropperTemplateProps {
  imageSrc: string;
  title: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  onZoomChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOffsetXChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOffsetYChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCropClick: () => void;
  onCancelClick: () => void;
  imgRef: RefObject<HTMLImageElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}
