export interface FloatingActionPanelHelpers {
  closeMenu: () => void;
  /** Leave the open panel and return to the toolbar (does not close the FAB). */
  backToToolbar: () => void;
  /** Override the open panel width/height (px). Cleared when leaving panel state. */
  setPanelSize: (width: number, height: number) => void;
  /**
   * When set, Escape in panel state calls this first. Return true to consume
   * the key (skip the default panel → toolbar step).
   */
  setPanelEscapeHandler: (handler: (() => boolean) | null) => void;
}
