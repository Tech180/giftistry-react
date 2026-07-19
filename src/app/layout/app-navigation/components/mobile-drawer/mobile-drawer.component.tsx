import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import { MobileDrawerProps } from './interfaces/mobile-drawer-props.interface';
import { MobileDrawerTemplate } from './mobile-drawer.html';
import styles from './mobile-drawer.module.css';

const CLOSE_MS = 500;
const DRAWER_WIDTH = 330;

export const MobileDrawer: React.FC<MobileDrawerProps> = (props) => {
  const { isOpen, onClose, drawerRef, isAuthenticated } = props;
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
    const drawer = drawerRef.current;
    const overlay = overlayRef.current;
    if (drawer) drawer.style.transform = '';
    if (overlay) overlay.style.opacity = '';
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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mounted, isOpen, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
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

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current.active) return;
    const touch = e.touches[0];
    if (!touch) return;

    dragRef.current.currentX = touch.clientX;
    let deltaX = touch.clientX - dragRef.current.startX;
    if (deltaX > 0) deltaX = 0;

    const drawer = drawerRef.current;
    const overlay = overlayRef.current;
    if (drawer) drawer.style.transform = `translateX(${deltaX}px)`;
    if (overlay) {
      const percentage = 1 - Math.abs(deltaX) / DRAWER_WIDTH;
      overlay.style.opacity = String(Math.max(0, percentage));
    }
  };

  const handleTouchEnd = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    setShowSwipeHandle(false);

    const { startX, currentX, startTime } = dragRef.current;
    const deltaX = currentX - startX;
    const velocity = Math.abs(deltaX) / Math.max(1, Date.now() - startTime);

    const overlay = overlayRef.current;
    if (overlay) overlay.style.opacity = '';

    if (deltaX < -100 || velocity > 0.5) {
      resetDragStyles();
      onClose();
    } else {
      const drawer = drawerRef.current;
      if (drawer) drawer.style.transform = 'translateX(0)';
    }

    dragRef.current = { startX: 0, currentX: 0, startTime: 0, active: false };
  };

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <MobileDrawerTemplate
      {...props}
      isActive={isActive}
      isDragging={isDragging}
      showSwipeHandle={showSwipeHandle}
      isDashboardActive={isDashboardActive}
      brandTo={brandTo}
      overlayRef={overlayRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      overlayClassName={`${styles.overlay} ${isActive ? styles['is-active'] : ''}`}
      drawerClassName={`${styles.drawer} ${isDragging ? styles['is-dragging'] : ''}`}
    />,
    document.body
  );
};
