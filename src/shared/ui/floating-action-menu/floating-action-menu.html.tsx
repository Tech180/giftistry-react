import React from 'react';
import { ChevronLeft, Plus, X, Gift } from 'lucide-react';
import type { FloatingActionMenuTemplateProps } from './interfaces/floating-action-menu-template-props.interface';
import styles from './floating-action-menu.module.css';

function actionOpensPanel(action: {
  children?: unknown[] | undefined;
  panelContent?: unknown;
}): boolean {
  return Boolean(action.panelContent) || (action.children?.length ?? 0) > 0;
}

export const FloatingActionMenuTemplate: React.FC<FloatingActionMenuTemplateProps> = ({
  actions,
  dockState,
  expandedActionId,
  ariaLabel,
  rootClass,
  toolbarHeight,
  panelHeight,
  panelWidth,
  hidePanelHeader,
  panelHelpers,
  setDockState,
  onActionClick,
  onChildClick,
  tooltip,
  onTooltipHover,
  onTooltipLeave,
}) => {
  const expandedAction = expandedActionId
    ? actions.find((a) => a.id === expandedActionId) ?? null
    : null;

  const dockSizeStyle =
    dockState === 'toolbar'
      ? { height: toolbarHeight }
      : dockState === 'panel'
        ? { height: panelHeight, width: panelWidth }
        : undefined;

  const panelBody =
    expandedAction?.panelContent == null
      ? null
      : typeof expandedAction.panelContent === 'function'
        ? expandedAction.panelContent(panelHelpers)
        : expandedAction.panelContent;

  return (
    <>
      <button
        type="button"
        className={[
          styles.backdrop,
          dockState !== 'closed' ? styles.backdropActive : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="Close actions"
        onClick={() => setDockState('closed')}
      />

      <div className={rootClass} style={dockSizeStyle}>
        {/* Face 1: Closed Button */}
        <button
          type="button"
          className={[styles.dockFace, styles.faceClosed].join(' ')}
          aria-label={ariaLabel}
          aria-haspopup="menu"
          aria-hidden={dockState !== 'closed'}
          tabIndex={dockState === 'closed' ? 0 : -1}
          onClick={() => {
            if (dockState === 'closed') setDockState('toolbar');
          }}
        >
          <Gift size={24} aria-hidden />
        </button>

        {/* Face 2: The Vertical Toolbar */}
        <div
          className={[styles.dockFace, styles.faceToolbar].join(' ')}
          aria-hidden={dockState !== 'toolbar'}
        >
          <div
            className={styles.toolbarGroup}
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
                  {needsDivider && <div className={styles.toolDivider} />}
                  <button
                    type="button"
                    {...(dockState === 'toolbar' ? { role: 'menuitem' } : {})}
                    className={[
                      styles.toolBtn,
                      toolbarTone === 'primary' ? styles.primary : '',
                      toolbarTone === 'danger' ? styles.danger : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-label={action.label}
                    aria-haspopup={opensPanel ? 'menu' : undefined}
                    aria-expanded={opensPanel ? expandedActionId === action.id : undefined}
                    disabled={action.disabled}
                    tabIndex={dockState === 'toolbar' ? 0 : -1}
                    onMouseEnter={(e) => onTooltipHover(e, action.label)}
                    onMouseLeave={onTooltipLeave}
                    onClick={() => onActionClick(action.id)}
                  >
                    <span className={styles.icon}>{action.icon}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          <div className={styles.toolbarGroup}>
            <button
              type="button"
              className={styles.toolBtn}
              aria-label="Close page actions"
              tabIndex={dockState === 'toolbar' ? 0 : -1}
              onMouseEnter={(e) => onTooltipHover(e, 'Close')}
              onMouseLeave={onTooltipLeave}
              onClick={() => setDockState('closed')}
            >
              <span className={styles.icon}>
                <X size={20} aria-hidden />
              </span>
            </button>
          </div>
        </div>

        {/* Face 3: Expanded Panel Menu */}
        <div
          className={[
            styles.dockFace,
            styles.facePanel,
            hidePanelHeader ? styles.facePanelFlush : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden={dockState !== 'panel'}
        >
          {expandedAction && (
            <>
              {hidePanelHeader ? null : (
                <div className={styles.panelHeader}>
                  <button
                    type="button"
                    className={styles.backBtn}
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
                <div className={styles.panelContent}>{panelBody}</div>
              ) : (
                <div
                  className={styles.panelList}
                  {...(dockState === 'panel'
                    ? { role: 'menu', 'aria-label': `${expandedAction.label} options` }
                    : {})}
                >
                  {expandedAction.children?.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      {...(dockState === 'panel' ? { role: 'menuitem' } : {})}
                      className={styles.listItem}
                      disabled={child.disabled}
                      tabIndex={dockState === 'panel' ? 0 : -1}
                      onClick={() => onChildClick(expandedAction.id, child.id)}
                    >
                      {child.icon ? (
                        <span className={styles.listItemIcon}>{child.icon}</span>
                      ) : (
                        <span className={styles.listItemIcon}>
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

      {/* Global positioned Tooltip */}
      <div
        className={[styles.tooltip, tooltip.visible ? styles.tooltipVisible : '']
          .filter(Boolean)
          .join(' ')}
        style={{
          top: tooltip.top,
          left: tooltip.left,
        }}
      >
        {tooltip.text}
      </div>
    </>
  );
};
