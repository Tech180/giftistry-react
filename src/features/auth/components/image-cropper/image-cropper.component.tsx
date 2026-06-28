import React, { useState, useRef } from 'react';
import { ImageCropperProps } from './interfaces/image-cropper-props.interface';
import { ImageCropperHtml } from './image-cropper.html';

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCrop, onCancel }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // The crop area is 200px. The image is drawn at:
    // centerX = canvas.width / 2 = 100
    // centerY = canvas.height / 2 = 100
    // Let's compute exact drawing coordinates:
    const drawWidth = img.naturalWidth * zoom;
    const drawHeight = img.naturalHeight * zoom;

    // Center of drawing is 100 + offsetX, 100 + offsetY
    const x = 100 + offsetX - drawWidth / 2;
    const y = 100 + offsetY - drawHeight / 2;

    ctx.drawImage(img, x, y, drawWidth, drawHeight);

    // Export base64
    const base64 = canvas.toDataURL('image/png');
    onCrop(base64);
  };

  return (
    <ImageCropperHtml
      imageSrc={imageSrc}
      zoom={zoom}
      setZoom={setZoom}
      offsetX={offsetX}
      setOffsetX={setOffsetX}
      offsetY={offsetY}
      setOffsetY={setOffsetY}
      onCropClick={handleCrop}
      onCancelClick={onCancel}
      imgRef={imgRef}
      canvasRef={canvasRef}
    />
  );
};
