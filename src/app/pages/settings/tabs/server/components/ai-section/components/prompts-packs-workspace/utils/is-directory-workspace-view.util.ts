import type { WorkspaceView } from '../interfaces/workspace-view.interface';

export function isDirectoryWorkspaceView(view: WorkspaceView): boolean {
  return (
    view.kind === 'directory' ||
    view.kind === 'pack-detail' ||
    view.kind === 'pack-create' ||
    view.kind === 'pack-edit'
  );
}
