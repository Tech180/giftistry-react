export interface PositionSelectMenuInput {
  triggerRect: {
    top: number;
    bottom: number;
    left: number;
    width: number;
  };
  menuWidth: number;
  menuHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  gap?: number;
  inset?: number;
}
