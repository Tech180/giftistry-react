import type { InstallTask } from '../../../interfaces/install-task.interface';

export interface InstallStepRow {
  task: InstallTask;
  labelModifier: string;
}
