import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { DrawerProps } from './interfaces/drawer-props.interface';
import { DrawerTemplate } from './drawer.html';
import {
  CLOSE_ARIA_LABEL,
  CLOSE_SIDEBAR_ARIA_LABEL,
} from './constants/close-aria-label.constant';
import { SHEET_MOBILE_QUERY, SHEET_OPEN_ATTR } from './constants/sheet.constant';
import { buildClasses } from './utils/build-classes.util';
import styles from './drawer.module.css';

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
  const isOverlay = variant === 'overlay';
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
  const showScrim = isOverlay || showSheetScrim;

  useLayoutEffect(() => {
    const el = drawerRef.current;
    if (!el) return;

    if (isOpen) {
      el.classList.remove(styles['drawer--active']);
      void el.getBoundingClientRect();
      el.classList.add(styles['drawer--active']);
    } else {
      el.classList.remove(styles['drawer--active']);
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

  const classes = buildClasses({
    position,
    variant,
    isSheet,
    overflowVisible,
    isOpen,
  });

  const showIconClose = isOverlay || Boolean(closeIcon);
  const resolvedCloseIcon = isOverlay ? (closeIcon ?? <X size={20} />) : closeIcon;
  const resolvedCloseAriaLabel =
    closeAriaLabel ?? (isOverlay ? CLOSE_SIDEBAR_ARIA_LABEL : CLOSE_ARIA_LABEL);

  return (
    <DrawerTemplate
      drawerRef = {
        drawerRef
      }
      drawerClass = {
        classes.drawerClass
      }
      headerClass = {
        classes.headerClass
      }
      titleClass = {
        classes.titleClass
      }
      footerClass = {
        classes.footerClass
      }
      overlayClass = {
        classes.overlayClass
      }
      title = {
        title
      }
      onClose = {
        onClose
      }
      miniDrawer = {
        resolvedMiniDrawer
      }
      integrateMiniInSheet = {
        integrateMiniInSheet
      }
      position = {
        position
      }
      showScrim = {
        showScrim
      }
      showFooter = {
        Boolean(footer)
      }
      showTitleIcon = {
        Boolean(titleIcon)
      }
      showIconClose = {
        showIconClose
      }
      showTextClose = {
        !showIconClose
      }
      footer = {
        footer
      }
      titleIcon = {
        titleIcon
      }
      titleExtra = {
        titleExtra
      }
      headerExtra = {
        headerExtra
      }
      isOpen = {
        isOpen
      }
      onOverlayClick = {
        onOverlayClick ?? onClose
      }
      resolvedCloseIcon = {
        resolvedCloseIcon
      }
      closeAriaLabel = {
        resolvedCloseAriaLabel
      }
    >
      {children}
    </DrawerTemplate>
  );
};
