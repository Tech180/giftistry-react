import React, { useState, useRef } from 'react';
import type { ImageCropperProps } from './interfaces/image-cropper-props.interface';
import { ImageCropperTemplate } from './image-cropper.html';

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCrop,
  onCancel,
  title = 'Crop image',
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawWidth = img.naturalWidth * zoom;
    const drawHeight = img.naturalHeight * zoom;
    const x = 100 + offsetX - drawWidth / 2;
    const y = 100 + offsetY - drawHeight / 2;

    ctx.drawImage(img, x, y, drawWidth, drawHeight);

    const base64 = canvas.toDataURL('image/png');
    onCrop(base64);
  };

  const onZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Number.parseFloat(event.target.value));
  };

  const onOffsetXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOffsetX(Number.parseInt(event.target.value, 10));
  };

  const onOffsetYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOffsetY(Number.parseInt(event.target.value, 10));
  };

  return (
    <ImageCropperTemplate
      imageSrc = {
        imageSrc
      }
      title = {
        title
      }
      zoom = {
        zoom
      }
      offsetX = {
        offsetX
      }
      offsetY = {
        offsetY
      }
      onZoomChange = {
        onZoomChange
      }
      onOffsetXChange = {
        onOffsetXChange
      }
      onOffsetYChange = {
        onOffsetYChange
      }
      onCropClick = {
        handleCrop
      }
      onCancelClick = {
        onCancel
      }
      imgRef = {
        imgRef
      }
      canvasRef = {
        canvasRef
      }
    />
  );
};
