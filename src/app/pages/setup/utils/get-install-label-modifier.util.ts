import type { InstallTaskStatus } from '../interfaces/install-task-status.type';

export function getInstallLabelModifier(status: InstallTaskStatus): string {
  if (status === 'active') {
    return 'install-step__label--active';
  }

  if (status === 'done') {
    return 'install-step__label--done';
  }

  return '';
}
