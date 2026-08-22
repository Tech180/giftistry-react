import React, { useEffect, useRef, useState } from 'react';
import type { FloatingActionMenuProps } from './interfaces/floating-action-menu-props.interface';
import type { FloatingActionPanelHelpers } from './interfaces/floating-action.interface';
import { FloatingActionMenuTemplate } from './floating-action-menu.html';
import styles from './floating-action-menu.module.css';

export type {
  FloatingAction,
  FloatingActionChild,
  FloatingActionPanelHelpers,
} from './interfaces/floating-action.interface';
export type { FloatingActionMenuProps } from './interfaces/floating-action-menu-props.interface';

function actionOpensPanel(action: {
  children?: unknown[] | undefined;
  panelContent?: unknown;
}): boolean {
  return Boolean(action.panelContent) || (action.children?.length ?? 0) > 0;
}

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  actions,
  open: openProp,
  onOpenChange,
  ariaLabel = 'Page actions',
  className = '',
}) => {
  const isControlled = openProp !== undefined;
  const [dockStateInternal, setDockStateInternal] = useState<'closed' | 'toolbar' | 'panel'>('closed');
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);
  const [panelSizeOverride, setPanelSizeOverride] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const panelEscapeHandlerRef = useRef<(() => boolean) | null>(null);

  const dockState = isControlled
    ? openProp
      ? expandedActionId
        ? 'panel'
        : 'toolbar'
      : 'closed'
    : dockStateInternal;

  const setDockState = (nextState: 'closed' | 'toolbar' | 'panel') => {
    if (nextState !== 'panel') {
      setPanelSizeOverride(null);
      panelEscapeHandlerRef.current = null;
    }
    if (!isControlled) {
      setDockStateInternal(nextState);
    }
    if (nextState === 'closed') {
      onOpenChange?.(false);
      setExpandedActionId(null);
    } else {
      onOpenChange?.(true);
    }
  };

  // Sync state when controlled openProp changes
  useEffect(() => {
    if (isControlled) {
      if (openProp) {
        if (dockStateInternal === 'closed') {
          setDockStateInternal('toolbar');
        }
      } else {
        setDockStateInternal('closed');
        setExpandedActionId(null);
        setPanelSizeOverride(null);
        panelEscapeHandlerRef.current = null;
      }
    }
  }, [openProp, isControlled, dockStateInternal]);

  // Escape key support
  useEffect(() => {
    if (dockState === 'closed') return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (dockState === 'panel') {
        if (panelEscapeHandlerRef.current?.()) {
          event.preventDefault();
          return;
        }
        setDockState('toolbar');
        return;
      }
      setDockState('closed');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dockState]);

  // Close when viewport grows past the mobile FAB breakpoint (matches CSS hide).
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 48.0625rem)');

    const closeIfDesktop = () => {
      if (mediaQuery.matches) {
        setDockState('closed');
      }
    };

    closeIfDesktop();
    mediaQuery.addEventListener('change', closeIfDesktop);
    return () => mediaQuery.removeEventListener('change', closeIfDesktop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tooltip State
  const [tooltip, setTooltip] = useState<{
    text: string;
    top: number;
    left: number;
    visible: boolean;
  }>({ text: '', top: 0, left: 0, visible: false });

  const handleTooltipHover = (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      text,
      top: rect.top + rect.height / 2,
      left: rect.left - 14,
      visible: true,
    });
  };

  const handleTooltipLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const handleActionClick = (actionId: string) => {
    handleTooltipLeave();
    const action = actions.find((item) => item.id === actionId);
    if (!action || action.disabled) return;

    if (actionOpensPanel(action)) {
      setExpandedActionId(actionId);
      setDockState('panel');
      return;
    }

    action.onClick?.();
    setDockState('closed');
  };

  const handleChildClick = (actionId: string, childId: string) => {
    handleTooltipLeave();
    const action = actions.find((item) => item.id === actionId);
    const child = action?.children?.find((item) => item.id === childId);
    if (!child || child.disabled) return;
    child.onClick();
    setDockState('closed');
  };

  /* Compute the exact toolbar height based on the number of actions.
   * Button: 44px, gap: 6px, divider item: 9px (1px + 4px margin × 2) plus an
   * extra flex gap because the divider is an additional item, close: 44px,
   * space between groups: 6px, padding: 10px top + 10px bottom.
   */
  const toolbarHeight = (() => {
    const BTN = 44;
    const GAP = 6;
    const DIVIDER = 9; // 1px line + 4px margin × 2
    const PAD = 20; // 10px top + 10px bottom

    const dividerCount = actions.filter(
      (a, i) => actionOpensPanel(a) && i > 0 && !a.hideToolbarDivider
    ).length;

    const actionGroupHeight =
      actions.length * BTN +
      Math.max(0, actions.length - 1 + dividerCount) * GAP +
      dividerCount * DIVIDER;

    const closeGroupHeight = BTN;
    const spaceBetweenGroups = GAP;

    return actionGroupHeight + spaceBetweenGroups + closeGroupHeight + PAD;
  })();

  const expandedAction = actions.find((a) => a.id === expandedActionId) ?? null;

  const defaultPanelWidth = expandedAction?.panelContent
    ? (expandedAction.panelWidth ?? 280)
    : 220;

  /* Panel: padding 16×2, header 28 + 16 margin, items 38px, gap 4px.
   * Custom panelContent uses explicit panelHeight (default 300). */
  const defaultPanelHeight = (() => {
    if (expandedAction?.panelContent) {
      return expandedAction.panelHeight ?? 300;
    }

    const childCount = expandedAction?.children?.length ?? 0;
    const PAD = 32;
    const HEADER = 44; // 28px back button + 16px margin-bottom
    const ITEM = 38;
    const GAP = 4;

    return PAD + HEADER + childCount * ITEM + Math.max(0, childCount - 1) * GAP;
  })();

  const panelWidth = panelSizeOverride?.width ?? defaultPanelWidth;
  const panelHeight = panelSizeOverride?.height ?? defaultPanelHeight;
  const hidePanelHeader = Boolean(expandedAction?.hidePanelHeader);
  const sizeFluid = dockState === 'panel' && panelSizeOverride !== null;

  const panelHelpers: FloatingActionPanelHelpers = {
    closeMenu: () => setDockState('closed'),
    setPanelSize: (width, height) => {
      setPanelSizeOverride((prev) => {
        if (prev?.width === width && prev?.height === height) return prev;
        return { width, height };
      });
    },
    setPanelEscapeHandler: (handler) => {
      panelEscapeHandlerRef.current = handler;
    },
  };

  const stateClass =
    dockState === 'closed'
      ? styles.stateClosed
      : dockState === 'toolbar'
        ? styles.stateToolbar
        : styles.statePanel;

  const rootClass = [styles.root, stateClass, sizeFluid ? styles.sizeFluid : '', className]
    .filter(Boolean)
    .join(' ');

  if (actions.length === 0) {
    return null;
  }

  return (
    <FloatingActionMenuTemplate
      actions={actions}
      dockState={dockState}
      expandedActionId={expandedActionId}
      ariaLabel={ariaLabel}
      className={className}
      rootClass={rootClass}
      toolbarHeight={toolbarHeight}
      panelHeight={panelHeight}
      panelWidth={panelWidth}
      hidePanelHeader={hidePanelHeader}
      panelHelpers={panelHelpers}
      setDockState={setDockState}
      onActionClick={handleActionClick}
      onChildClick={handleChildClick}
      tooltip={tooltip}
      onTooltipHover={handleTooltipHover}
      onTooltipLeave={handleTooltipLeave}
    />
  );
};
