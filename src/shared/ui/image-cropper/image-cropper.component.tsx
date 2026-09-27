import React, { useEffect, useRef, useState } from 'react';
import {
  MAX_ZOOM_FACTOR,
  OUTPUT_SIZE,
  WHEEL_ZOOM_SENSITIVITY,
} from './constants/crop.constant';
import type { ImageCropperProps } from './interfaces/image-cropper-props.interface';
import { ImageCropperTemplate } from './image-cropper.html';
import { clampCropOffset } from './utils/clamp-crop-offset.util';
import { clampZoom } from './utils/clamp-zoom.util';
import { coverMinZoom } from './utils/cover-min-zoom.util';
import { mapCropToOutput } from './utils/map-crop-to-output.util';

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCrop,
  onCancel,
  title = 'Crop image',
}) => {
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [minZoom, setMinZoom] = useState(0.5);
  const [maxZoom, setMaxZoom] = useState(3);
  const [isDragging, setIsDragging] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cropAreaRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const naturalRef = useRef({ width: 0, height: 0 });
  const ringDiameterRef = useRef(OUTPUT_SIZE);
  const zoomRef = useRef(zoom);
  const offsetRef = useRef({ x: offsetX, y: offsetY });
  const boundsRef = useRef({ min: minZoom, max: maxZoom });
  const applyZoomRef = useRef<(next: number) => void>(() => undefined);

  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originOffsetX: number;
    originOffsetY: number;
  } | null>(null);
  const pinchRef = useRef<{ startDistance: number; startZoom: number } | null>(null);

  useEffect(() => {
    zoomRef.current = zoom;
    offsetRef.current = { x: offsetX, y: offsetY };
    boundsRef.current = { min: minZoom, max: maxZoom };
  }, [zoom, offsetX, offsetY, minZoom, maxZoom]);

  const applyOffset = (nextX: number, nextY: number) => {
    const { width, height } = naturalRef.current;
    const clamped = clampCropOffset(nextX, nextY, width, height, zoomRef.current, ringDiameterRef.current);
    setOffsetX(clamped.offsetX);
    setOffsetY(clamped.offsetY);
    offsetRef.current = { x: clamped.offsetX, y: clamped.offsetY };
  };

  const applyZoom = (next: number) => {
    const { min, max } = boundsRef.current;
    const { width, height } = naturalRef.current;
    const z = clampZoom(next, min, max);
    const clamped = clampCropOffset(
      offsetRef.current.x,
      offsetRef.current.y,
      width,
      height,
      z,
      ringDiameterRef.current,
    );
    setZoom(z);
    setOffsetX(clamped.offsetX);
    setOffsetY(clamped.offsetY);
    zoomRef.current = z;
    offsetRef.current = { x: clamped.offsetX, y: clamped.offsetY };
  };

  useEffect(() => {
    applyZoomRef.current = applyZoom;
  });

  const pointerDistance = () => {
    const points = [...pointersRef.current.values()];
    if (points.length < 2) {
      return 0;
    }

    return Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
  };

  const syncFromImage = () => {
    const img = imgRef.current;
    const ring = ringRef.current;
    if (!img || !ring || img.naturalWidth <= 0) {
      return;
    }

    const diameter = ring.getBoundingClientRect().width;
    const min = coverMinZoom(img.naturalWidth, img.naturalHeight, diameter);
    const max = min * MAX_ZOOM_FACTOR;
    naturalRef.current = { width: img.naturalWidth, height: img.naturalHeight };
    ringDiameterRef.current = diameter;
    boundsRef.current = { min, max };
    setMinZoom(min);
    setMaxZoom(max);
    setZoom(min);
    setOffsetX(0);
    setOffsetY(0);
    zoomRef.current = min;
    offsetRef.current = { x: 0, y: 0 };
  };

  const syncFromImageRef = useRef(syncFromImage);
  useEffect(() => {
    syncFromImageRef.current = syncFromImage;
  });

  useEffect(() => {
    syncFromImageRef.current();
  }, [imageSrc]);

  useEffect(() => {
    const el = cropAreaRef.current;
    if (!el) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      applyZoomRef.current(zoomRef.current - event.deltaY * WHEEL_ZOOM_SENSITIVITY);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const diameter = ring.getBoundingClientRect().width;
      const { width, height } = naturalRef.current;
      if (width <= 0 || height <= 0 || diameter <= 0) {
        return;
      }

      const min = coverMinZoom(width, height, diameter);
      const max = min * MAX_ZOOM_FACTOR;
      ringDiameterRef.current = diameter;
      boundsRef.current = { min, max };
      setMinZoom(min);
      setMaxZoom(max);
      applyZoomRef.current(zoomRef.current);
    });

    observer.observe(ring);
    return () => observer.disconnect();
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const count = pointersRef.current.size;
    if (count === 1) {
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originOffsetX: offsetRef.current.x,
        originOffsetY: offsetRef.current.y,
      };
      pinchRef.current = null;
      setIsDragging(true);
      return;
    }

    if (count === 2) {
      dragRef.current = null;
      setIsDragging(false);
      const distance = pointerDistance();
      pinchRef.current = {
        startDistance: distance > 0 ? distance : 1,
        startZoom: zoomRef.current,
      };
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(event.pointerId)) {
      return;
    }

    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pinchRef.current && pointersRef.current.size >= 2) {
      const distance = pointerDistance();
      applyZoom(pinchRef.current.startZoom * (distance / pinchRef.current.startDistance));
      return;
    }

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    applyOffset(drag.originOffsetX + (event.clientX - drag.startX), drag.originOffsetY + (event.clientY - drag.startY));
  };

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointersRef.current.has(event.pointerId)) {
      pointersRef.current.delete(event.pointerId);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const count = pointersRef.current.size;
    if (count === 1) {
      pinchRef.current = null;
      const [pointerId, point] = [...pointersRef.current.entries()][0];
      dragRef.current = {
        pointerId,
        startX: point.x,
        startY: point.y,
        originOffsetX: offsetRef.current.x,
        originOffsetY: offsetRef.current.y,
      };
      setIsDragging(true);
      return;
    }

    if (count === 0) {
      dragRef.current = null;
      pinchRef.current = null;
      setIsDragging(false);
    }
  };

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

    const mapped = mapCropToOutput(zoom, offsetX, offsetY, ringDiameterRef.current, OUTPUT_SIZE);
    const drawWidth = img.naturalWidth * mapped.zoom;
    const drawHeight = img.naturalHeight * mapped.zoom;
    const x = OUTPUT_SIZE / 2 + mapped.offsetX - drawWidth / 2;
    const y = OUTPUT_SIZE / 2 + mapped.offsetY - drawHeight / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
    onCrop(canvas.toDataURL('image/png'));
  };

  const onZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyZoom(Number.parseFloat(event.target.value));
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
      minZoom = {
        minZoom
      }
      maxZoom = {
        maxZoom
      }
      offsetX = {
        offsetX
      }
      offsetY = {
        offsetY
      }
      isDragging = {
        isDragging
      }
      onZoomChange = {
        onZoomChange
      }
      onCropClick = {
        handleCrop
      }
      onCancelClick = {
        onCancel
      }
      onImageLoad = {
        () => syncFromImageRef.current()
      }
      onPointerDown = {
        onPointerDown
      }
      onPointerMove = {
        onPointerMove
      }
      onPointerUp = {
        endPointer
      }
      onPointerCancel = {
        endPointer
      }
      imgRef = {
        imgRef
      }
      canvasRef = {
        canvasRef
      }
      cropAreaRef = {
        cropAreaRef
      }
      ringRef = {
        ringRef
      }
    />
  );
};
