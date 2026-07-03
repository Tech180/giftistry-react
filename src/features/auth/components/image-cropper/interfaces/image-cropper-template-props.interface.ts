import React from 'react';

export interface ImageCropperTemplateProps {
  imageSrc: string;
  zoom: number;
  setZoom: (v: number) => void;
  offsetX: number;
  setOffsetX: (v: number) => void;
  offsetY: number;
  setOffsetY: (v: number) => void;
  onCropClick: () => void;
  onCancelClick: () => void;
  imgRef: React.RefObject<HTMLImageElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}
