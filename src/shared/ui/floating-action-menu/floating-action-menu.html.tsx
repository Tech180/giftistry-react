import React from 'react';
import { ChevronLeft, Plus, X, Gift } from 'lucide-react';
import type { FloatingActionMenuTemplateProps } from './interfaces/floating-action-menu-template-props.interface';
import { actionOpensPanel } from './utils/action-opens-panel.util';
import styles from './floating-action-menu.module.css';

export const FloatingActionMenuTemplate: React.FC<FloatingActionMenuTemplateProps> = ({
  actions,
  dockState,
  expandedActionId,
  expandedAction,
  ariaLabel,
  rootClass,
  dockSizeStyle,
  hidePanelHeader,
  panelBody,
  faceClosedClass,
  faceToolbarClass,
  facePanelClass,
  backdropClass,
  tooltipClass,
  closedTourTarget,
  setDockState,
  onActionClick,
  onChildClick,
  tooltip,
  onTooltipHover,
  onTooltipLeave,
}) => (
  <>
    <button
      type="button"
      className={backdropClass}
      aria-label="Close actions"
      onClick={() => setDockState('closed')}
    />

    <div className={rootClass} style={dockSizeStyle}>
      <button
        type="button"
        className={faceClosedClass}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-hidden={dockState !== 'closed'}
        tabIndex={dockState === 'closed' ? 0 : -1}
        data-tour={closedTourTarget}
        onClick={() => {
          if (dockState === 'closed') {
            setDockState('toolbar');
          }
        }}
      >
        <Gift size={24} aria-hidden />
      </button>

      <div className={faceToolbarClass} aria-hidden={dockState !== 'toolbar'}>
        <div
          className={styles['floating-action-menu__toolbar-group']}
          {...(dockState === 'toolbar'
            ? { role: 'menu', 'aria-label': ariaLabel }
            : {})}
        >
          {actions.map((action, idx) => {
            const opensPanel = actionOpensPanel(action);
            const needsDivider = opensPanel && idx > 0 && !action.hideToolbarDivider;
            const toolbarTone =
              action.toolbarTone ?? (opensPanel ? 'primary' : 'default');

            return (
              <React.Fragment key={action.id}>
                {needsDivider && (
                  <div className={styles['floating-action-menu__tool-divider']} />
                )}
                <button
                  type="button"
                  {...(dockState === 'toolbar' ? { role: 'menuitem' } : {})}
                  className={[
                    styles['floating-action-menu__tool-btn'],
                    toolbarTone === 'primary'
                      ? styles['floating-action-menu__tool-btn--primary']
                      : '',
                    toolbarTone === 'danger'
                      ? styles['floating-action-menu__tool-btn--danger']
                      : '',
                    action.toolbarMuted
                      ? styles['floating-action-menu__tool-btn--muted']
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label={action.label}
                  aria-haspopup={opensPanel ? 'menu' : undefined}
                  aria-expanded={opensPanel ? expandedActionId === action.id : undefined}
                  disabled={action.disabled}
                  tabIndex={dockState === 'toolbar' ? 0 : -1}
                  data-tour={action.tourTarget}
                  onMouseEnter={(e) => onTooltipHover(e, action.label)}
                  onMouseLeave={onTooltipLeave}
                  onClick={() => onActionClick(action.id)}
                >
                  <span className={styles['floating-action-menu__icon']}>{action.icon}</span>
                </button>
                {action.separateAfter && (
                  <div className={styles['floating-action-menu__tool-divider']} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className={styles['floating-action-menu__toolbar-group']}>
          <button
            type="button"
            className={styles['floating-action-menu__tool-btn']}
            aria-label="Close page actions"
            tabIndex={dockState === 'toolbar' ? 0 : -1}
            onMouseEnter={(e) => onTooltipHover(e, 'Close')}
            onMouseLeave={onTooltipLeave}
            onClick={() => setDockState('closed')}
          >
            <span className={styles['floating-action-menu__icon']}>
              <X size={20} aria-hidden />
            </span>
          </button>
        </div>
      </div>

      <div className={facePanelClass} aria-hidden={dockState !== 'panel'}>
        {expandedAction && (
          <>
            {hidePanelHeader ? null : (
              <div className={styles['floating-action-menu__panel-header']}>
                <button
                  type="button"
                  className={styles['floating-action-menu__back-btn']}
                  aria-label="Go back"
                  tabIndex={dockState === 'panel' ? 0 : -1}
                  onClick={() => setDockState('toolbar')}
                >
                  <ChevronLeft size={18} aria-hidden />
                </button>
                <span>{expandedAction.label}</span>
              </div>
            )}

            {panelBody ? (
              <div className={styles['floating-action-menu__panel-content']}>{panelBody}</div>
            ) : (
              <div
                className={styles['floating-action-menu__panel-list']}
                {...(dockState === 'panel'
                  ? { role: 'menu', 'aria-label': `${expandedAction.label} options` }
                  : {})}
              >
                {expandedAction.children?.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    {...(dockState === 'panel' ? { role: 'menuitem' } : {})}
                    className={styles['floating-action-menu__list-item']}
                    disabled={child.disabled}
                    tabIndex={dockState === 'panel' ? 0 : -1}
                    onClick={() => onChildClick(expandedAction.id, child.id)}
                  >
                    {child.icon ? (
                      <span className={styles['floating-action-menu__list-item-icon']}>
                        {child.icon}
                      </span>
                    ) : (
                      <span className={styles['floating-action-menu__list-item-icon']}>
                        <Plus size={16} aria-hidden />
                      </span>
                    )}
                    <span>{child.label}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>

    <div
      className={tooltipClass}
      style={{
        top: tooltip.top,
        left: tooltip.left,
      }}
    >
      {tooltip.text}
    </div>
  </>
);
