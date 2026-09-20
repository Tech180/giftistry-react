import type { InstallTaskStatus } from './install-task-status.type';

export interface InstallTask {
  id: string;
  label: string;
  status: InstallTaskStatus;
}
