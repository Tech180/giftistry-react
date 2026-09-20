import type { Dispatch, SetStateAction } from 'react';
import { INITIAL_INSTALL_TASKS } from '../constants/install-tasks.constant';
import type { InstallTask } from '../interfaces/install-task.interface';
import type { InstallTaskStatus } from '../interfaces/install-task-status.type';
import { sleep } from './sleep.util';

export function setTaskStatus(
  setInstallTasks: Dispatch<SetStateAction<InstallTask[]>>,
  index: number,
  status: InstallTaskStatus,
): void {
  setInstallTasks((prev) => prev.map((task, i) => (i === index ? { ...task, status } : task)));
}

export async function runInstallProgress(
  apiPromise: Promise<unknown>,
  setInstallTasks: Dispatch<SetStateAction<InstallTask[]>>,
): Promise<void> {
  const tasks = INITIAL_INSTALL_TASKS;
  setInstallTasks(tasks.map((t) => ({ ...t, status: 'pending' })));

  let apiError: unknown = null;

  const apiDone = apiPromise.then(
    () => undefined,
    (err) => {
      apiError = err;
    },
  );

  for (let i = 0; i < tasks.length; i++) {
    setTaskStatus(setInstallTasks, i, 'active');

    if (i < tasks.length - 1) {
      await sleep(450 + Math.random() * 350);
      if (apiError) {
        break;
      }
      setTaskStatus(setInstallTasks, i, 'done');
    } else {
      await apiDone;
      if (!apiError) {
        setTaskStatus(setInstallTasks, i, 'done');
      }
    }
  }

  if (!apiError) {
    setInstallTasks((prev) => prev.map((t) => ({ ...t, status: 'done' as const })));
  }

  await apiDone;
  if (apiError) {
    throw apiError;
  }
}
