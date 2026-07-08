import React from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../icon-button/icon-button.component';
import { DrawerTemplateProps } from './interfaces/drawer-template-props.interface';
import styles from './drawer.module.css';

export const DrawerTemplate: React.FC<DrawerTemplateProps> = ({
  drawerClass,
  drawerRef,
  title,
  onClose,
  children,
  miniDrawer,
  variant = 'default',
  footer,
  titleIcon,
  isOpen = false,
  onOverlayClick,
}) => {
  const isOverlay = variant === 'overlay';

  return (
    <>
      {isOverlay && (
        <div
          className={`${styles.overlay} ${isOpen ? styles['overlay-active'] : ''}`}
          onClick={onOverlayClick}
          aria-hidden={!isOpen}
        />
      )}
      <div ref={drawerRef} className={drawerClass}>
        {miniDrawer}
        <div className={styles['drawer-panel']}>
          <div className={isOverlay ? styles['drawer-header-overlay'] : styles['drawer-header']}>
            <h4 className={isOverlay ? styles['drawer-title-overlay'] : styles['drawer-title']}>
              {titleIcon && <span className={styles['drawer-title-icon']}>{titleIcon}</span>}
              {title}
            </h4>
            {isOverlay ? (
              <IconButton
                icon={<X size={20} />}
                ariaLabel="Close sidebar"
                variant="ghost"
                size="sm"
                onClick={onClose}
              />
            ) : (
              <button onClick={onClose} className={styles['drawer-close']}>
                &times;
              </button>
            )}
          </div>
          <div className={isOverlay ? styles['drawer-body-overlay'] : styles['drawer-body']}>
            {children}
          </div>
          {footer && (
            <div className={styles['drawer-footer']}>{footer}</div>
          )}
        </div>
      </div>
    </>
  );
};
