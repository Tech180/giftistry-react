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
  mobilePresentation = 'rail',
  showScrim = false,
  footer,
  titleIcon,
  titleExtra,
  headerExtra,
  isOpen = false,
  onOverlayClick,
}) => {
  const isOverlay = variant === 'overlay';
  const isSheet = mobilePresentation === 'sheet';

  return (
    <>
      {showScrim && (
        <div
          className={`${styles.overlay} ${isSheet ? styles['sheet-scrim'] : ''} ${isOpen ? styles['overlay-active'] : ''}`}
          onClick={onOverlayClick}
          aria-hidden={!isOpen}
          data-testid="drawer-scrim"
        />
      )}
      <div
        ref={drawerRef}
        className={drawerClass}
        data-testid="drawer-panel"
        aria-hidden={!isOpen}
      >
        {!isSheet && miniDrawer}
        <div className={styles['drawer-panel']}>
          <div className={isOverlay ? styles['drawer-header-overlay'] : styles['drawer-header']}>
            <h4 className={isOverlay ? styles['drawer-title-overlay'] : styles['drawer-title']}>
              {titleIcon && <span className={styles['drawer-title-icon']}>{titleIcon}</span>}
              {title}
              {titleExtra}
            </h4>
            <div className={styles['drawer-header-actions']}>
              {headerExtra}
              {isOverlay ? (
                <IconButton
                  icon={<X size={20} />}
                  ariaLabel="Close sidebar"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                />
              ) : (
                <button onClick={onClose} className={styles['drawer-close']} aria-label="Close">
                  &times;
                </button>
              )}
            </div>
          </div>
          {isSheet && miniDrawer}
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
