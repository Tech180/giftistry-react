import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { DrawerProps } from './interfaces/drawer-props.interface';
import { DrawerTemplate } from './drawer.html';
import styles from './drawer.module.css';

const SHEET_OPEN_ATTR = 'data-drawer-sheet-open';

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
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const isSheet = mobilePresentation === 'sheet';
  const showScrim = variant === 'overlay' || isSheet;

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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.setAttribute(SHEET_OPEN_ATTR, 'true');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.removeAttribute(SHEET_OPEN_ATTR);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSheet, isOpen, onClose]);

  const resolvedMiniDrawer =
    miniDrawer && isSheet && React.isValidElement(miniDrawer)
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
      showScrim={showScrim}
      footer={footer}
      titleIcon={titleIcon}
      titleExtra={titleExtra}
      headerExtra={headerExtra}
      isOpen={isOpen}
      onOverlayClick={onOverlayClick ?? onClose}
    >
      {children}
    </DrawerTemplate>
  );
};
