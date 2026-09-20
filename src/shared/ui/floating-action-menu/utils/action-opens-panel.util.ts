export function actionOpensPanel(action: {
  children?: unknown[] | undefined;
  panelContent?: unknown;
}): boolean {
  return Boolean(action.panelContent) || (action.children?.length ?? 0) > 0;
}
