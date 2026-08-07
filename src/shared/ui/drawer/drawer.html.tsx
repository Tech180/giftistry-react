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
  integrateMiniInSheet = false,
  position,
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

  const header = (
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
  );

  const bodyAndFooter = (
    <>
      <div className={isOverlay ? styles['drawer-body-overlay'] : styles['drawer-body']}>
        {children}
      </div>
      {footer && <div className={styles['drawer-footer']}>{footer}</div>}
    </>
  );

  const mainColumn = integrateMiniInSheet ? (
    <div className={styles['drawer-sheet-main']}>{bodyAndFooter}</div>
  ) : (
    bodyAndFooter
  );

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
        {!integrateMiniInSheet && miniDrawer}
        <div className={styles['drawer-panel']}>
          {header}
          {integrateMiniInSheet ? (
            <div className={styles['drawer-sheet-content']} data-testid="drawer-sheet-content">
              {position === 'right' && miniDrawer}
              {mainColumn}
              {position === 'left' && miniDrawer}
            </div>
          ) : (
            mainColumn
          )}
        </div>
      </div>
    </>
  );
};
