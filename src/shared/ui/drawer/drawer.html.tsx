import React from 'react';
import { IconButton } from '../icon-button/icon-button.component';
import { DrawerTemplateProps } from './interfaces/drawer-template-props.interface';
import styles from './drawer.module.css';

export const DrawerTemplate: React.FC<DrawerTemplateProps> = ({
  drawerClass,
  headerClass,
  titleClass,
  footerClass,
  overlayClass,
  drawerRef,
  title,
  onClose,
  children,
  miniDrawer,
  integrateMiniInSheet,
  position,
  showScrim,
  showFooter,
  showTitleIcon,
  showIconClose,
  showTextClose,
  footer,
  titleIcon,
  titleExtra,
  headerExtra,
  isOpen,
  onOverlayClick,
  resolvedCloseIcon,
  closeAriaLabel,
}) => {
  const header = (
    <div className={headerClass}>
      <h4 className={titleClass}>
        {showTitleIcon && (
          <span className={styles['drawer__title-icon']}>{titleIcon}</span>
        )}
        {title}
        {titleExtra}
      </h4>
      <div className={styles['drawer__header-actions']}>
        {headerExtra}
        {showIconClose && (
          <IconButton
            icon = {
              resolvedCloseIcon
            }
            ariaLabel = {
              closeAriaLabel
            }
            variant = {
              'ghost'
            }
            size = {
              'sm'
            }
            onClick = {
              onClose
            }
          />
        )}
        {showTextClose && (
          <button
            onClick={onClose}
            className={styles['drawer__close']}
            aria-label={closeAriaLabel}
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );

  const bodyAndFooter = (
    <>
      <div className={styles['drawer__body']}>{children}</div>
      {showFooter && <div className={footerClass}>{footer}</div>}
    </>
  );

  const mainColumn = integrateMiniInSheet ? (
    <div className={styles['drawer__sheet-main']}>{bodyAndFooter}</div>
  ) : (
    bodyAndFooter
  );

  return (
    <>
      {showScrim && (
        <div
          className={overlayClass}
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
        <div className={styles['drawer__panel']}>
          {header}
          {integrateMiniInSheet ? (
            <div
              className={styles['drawer__sheet-content']}
              data-testid="drawer-sheet-content"
            >
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
