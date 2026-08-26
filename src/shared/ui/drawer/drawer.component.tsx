import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DrawerProps } from './interfaces/drawer-props.interface';
import { DrawerTemplate } from './drawer.html';
import styles from './drawer.module.css';

const SHEET_OPEN_ATTR = 'data-drawer-sheet-open';
const SHEET_MOBILE_QUERY = '(max-width: 48rem)';

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  position,
  title,
  onClose,
  children,
  overflowVisible = false,
  miniDrawer,
  variant = 'default',
  mobilePresentation = 'rail',
  footer,
  titleIcon,
  titleExtra,
  headerExtra,
  onOverlayClick,
  closeIcon,
  closeAriaLabel,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const isSheet = mobilePresentation === 'sheet';
  const [isSheetMobile, setIsSheetMobile] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(SHEET_MOBILE_QUERY).matches;
  });

  useEffect(() => {
    if (!isSheet || typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia(SHEET_MOBILE_QUERY);
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsSheetMobile(event.matches);
    };

    handleChange(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [isSheet]);

  const showSheetScrim = isSheet && isSheetMobile;
  const showScrim = variant === 'overlay' || showSheetScrim;

  useLayoutEffect(() => {
    const el = drawerRef.current;
    if (!el) return;

    if (isOpen) {
      el.classList.remove(styles.active);
      void el.getBoundingClientRect();
      el.classList.add(styles.active);
    } else {
      el.classList.remove(styles.active);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isSheet || !isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSheet, isOpen, onClose]);

  useEffect(() => {
    if (!showSheetScrim || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.setAttribute(SHEET_OPEN_ATTR, 'true');

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.removeAttribute(SHEET_OPEN_ATTR);
    };
  }, [showSheetScrim, isOpen]);

  const integrateMiniInSheet = isSheet && isSheetMobile;
  const resolvedMiniDrawer =
    miniDrawer && integrateMiniInSheet && React.isValidElement(miniDrawer)
      ? React.cloneElement(miniDrawer as React.ReactElement<{ inlineOnMobile?: boolean }>, {
          inlineOnMobile: true,
        })
      : miniDrawer;

  const drawerClass = [
    styles['drawer-wrapper'],
    position === 'left' ? styles.left : styles.right,
    variant === 'overlay' ? styles['overlay-variant'] : '',
    isSheet ? styles.sheet : '',
    overflowVisible ? styles['overflow-visible'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <DrawerTemplate
      drawerRef={drawerRef}
      drawerClass={drawerClass}
      title={title}
      onClose={onClose}
      overflowVisible={overflowVisible}
      miniDrawer={resolvedMiniDrawer}
      variant={variant}
      mobilePresentation={mobilePresentation}
      integrateMiniInSheet={integrateMiniInSheet}
      position={position}
      showScrim={showScrim}
      footer={footer}
      titleIcon={titleIcon}
      titleExtra={titleExtra}
      headerExtra={headerExtra}
      isOpen={isOpen}
      onOverlayClick={onOverlayClick ?? onClose}
      closeIcon={closeIcon}
      closeAriaLabel={closeAriaLabel}
    >
      {children}
    </DrawerTemplate>
  );
};
