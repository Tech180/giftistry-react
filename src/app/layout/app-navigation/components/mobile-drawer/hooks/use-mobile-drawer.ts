import { useEffect, useLayoutEffect, useRef, useState, type TouchEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { CLOSE_MS } from '../constants/close-ms.constant';
import { DRAWER_WIDTH } from '../constants/drawer-width.constant';
import {
  SWIPE_CLOSE_DISTANCE_PX,
  SWIPE_CLOSE_VELOCITY,
} from '../constants/swipe-close.constant';
import type { UseMobileDrawerParams } from '../interfaces/use-mobile-drawer-params.interface';
import type { UseMobileDrawerResult } from '../interfaces/use-mobile-drawer-result.interface';
import styles from '../mobile-drawer.module.css';

export function useMobileDrawer({
  isOpen,
  onClose,
  drawerRef,
  isAuthenticated,
}: UseMobileDrawerParams): UseMobileDrawerResult {
  const location = useLocation();
  const [mounted, setMounted] = useState(isOpen);
  const [isActive, setIsActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSwipeHandle, setShowSwipeHandle] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef({ startX: 0, currentX: 0, startTime: 0, active: false });

  const isDashboardActive = location.pathname === '/dashboard';
  const brandTo = isAuthenticated ? '/dashboard' : '/';

  const resetDragStyles = () => {
    if (drawerRef.current) drawerRef.current.style.transform = '';
    if (overlayRef.current) overlayRef.current.style.opacity = '';
  };

  useEffect(() => {
    if (isOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setMounted(true);
      return;
    }

    setIsActive(false);
    resetDragStyles();
    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
      closeTimerRef.current = null;
    }, CLOSE_MS);

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [isOpen, drawerRef]);

  useLayoutEffect(() => {
    if (!mounted || !isOpen) return;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setIsActive(true);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [mounted, isOpen]);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mounted, isOpen, onClose]);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    dragRef.current = {
      startX: touch.clientX,
      currentX: touch.clientX,
      startTime: Date.now(),
      active: true,
    };
    setIsDragging(true);
    setShowSwipeHandle(true);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const touch = e.touches[0];
    if (!touch) return;

    dragRef.current.currentX = touch.clientX;
    let deltaX = touch.clientX - dragRef.current.startX;
    if (deltaX > 0) deltaX = 0;

    if (drawerRef.current) drawerRef.current.style.transform = `translateX(${deltaX}px)`;
    if (overlayRef.current) {
      overlayRef.current.style.opacity = String(Math.max(0, 1 - Math.abs(deltaX) / DRAWER_WIDTH));
    }
  };

  const onTouchEnd = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    setShowSwipeHandle(false);

    const { startX, currentX, startTime } = dragRef.current;
    const deltaX = currentX - startX;
    const velocity = Math.abs(deltaX) / Math.max(1, Date.now() - startTime);

    if (overlayRef.current) overlayRef.current.style.opacity = '';

    if (deltaX < -SWIPE_CLOSE_DISTANCE_PX || velocity > SWIPE_CLOSE_VELOCITY) {
      resetDragStyles();
      onClose();
    } else if (drawerRef.current) {
      drawerRef.current.style.transform = 'translateX(0)';
    }

    dragRef.current = { startX: 0, currentX: 0, startTime: 0, active: false };
  };

  return {
    mounted,
    isActive,
    isDragging,
    showSwipeHandle,
    isDashboardActive,
    brandTo,
    overlayRef,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    overlayClassName: `${styles.overlay}${isActive ? ` ${styles['is-active']}` : ''}`,
    drawerClassName: `${styles.drawer}${isDragging ? ` ${styles['is-dragging']}` : ''}`,
  };
}
