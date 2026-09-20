import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import type { Dispatch, SetStateAction } from 'react';
import type { InstallTask } from '../interfaces/install-task.interface';
import { INITIAL_INSTALL_TASKS } from '../constants/install-tasks.constant';
import { getInstallLabelModifier } from './get-install-label-modifier.util';
import { runInstallProgress, setTaskStatus } from './run-install-progress.util';
import { validateStep } from './validate-step.util';

vi.mock('./sleep.util', () => ({
  sleep: () => Promise.resolve(),
}));

const baseFields = {
  dbType: 'local' as const,
  dbUrl: '',
  adminUsername: 'adminuser',
  adminPassword: 'Password1',
  adminConfirmPassword: 'Password1',
  adminFirstName: 'Ada',
  adminLastName: 'Lovelace',
};

describe('setup validateStep', () => {
  test('step 1 local accepts empty dbUrl', () => {
    expect(validateStep(1, baseFields)).toEqual({});
  });

  test('step 1 remote requires postgres URL', () => {
    expect(
      validateStep(1, { ...baseFields, dbType: 'remote', dbUrl: '' }),
    ).toEqual({ dbUrl: 'Connection URL is required.' });

    expect(
      validateStep(1, { ...baseFields, dbType: 'remote', dbUrl: 'mysql://x' }),
    ).toEqual({ dbUrl: 'Must be a valid postgres:// or postgresql:// URL' });

    expect(
      validateStep(1, {
        ...baseFields,
        dbType: 'remote',
        dbUrl: 'postgres://localhost/db',
      }),
    ).toEqual({});
  });

  test('step 2 validates required admin fields', () => {
    const errors = validateStep(2, {
      ...baseFields,
      adminUsername: '',
      adminPassword: '',
      adminConfirmPassword: '',
      adminFirstName: '',
      adminLastName: '',
    });

    expect(errors.adminUsername).toBe('Username is required');
    expect(errors.adminFirstName).toBe('First name is required');
    expect(errors.adminLastName).toBe('Last name is required');
    expect(errors.adminPassword).toBe('Password is required');
  });

  test('step 2 rejects weak password and mismatch', () => {
    expect(
      validateStep(2, {
        ...baseFields,
        adminPassword: 'short',
        adminConfirmPassword: 'short',
      }).adminPassword,
    ).toBe('Password must be at least 8 characters');

    expect(
      validateStep(2, {
        ...baseFields,
        adminPassword: 'allletters',
        adminConfirmPassword: 'allletters',
      }).adminPassword,
    ).toBe('Password must include at least one letter and one number');

    expect(
      validateStep(2, {
        ...baseFields,
        adminConfirmPassword: 'Password2',
      }).adminConfirmPassword,
    ).toBe('Passwords do not match');
  });

  test('step 2 passes with valid admin fields', () => {
    expect(validateStep(2, baseFields)).toEqual({});
  });
});

describe('setup getInstallLabelModifier', () => {
  test('maps status to BEM modifier class', () => {
    expect(getInstallLabelModifier('active')).toBe('install-step__label--active');
    expect(getInstallLabelModifier('done')).toBe('install-step__label--done');
    expect(getInstallLabelModifier('pending')).toBe('');
  });
});

describe('setup runInstallProgress', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('setTaskStatus updates a single task', () => {
    const tasks = [...INITIAL_INSTALL_TASKS];
    const setInstallTasks: Dispatch<SetStateAction<InstallTask[]>> = (updater) => {
      const next = typeof updater === 'function' ? updater(tasks) : updater;
      tasks.splice(0, tasks.length, ...next);
    };

    setTaskStatus(setInstallTasks, 1, 'active');
    expect(tasks[1]?.status).toBe('active');
    expect(tasks[0]?.status).toBe('pending');
  });

  test('marks all tasks done when api resolves', async () => {
    let latest: InstallTask[] = [...INITIAL_INSTALL_TASKS];
    const setInstallTasks: Dispatch<SetStateAction<InstallTask[]>> = (updater) => {
      latest = typeof updater === 'function' ? updater(latest) : updater;
    };

    await runInstallProgress(Promise.resolve(), setInstallTasks);
    expect(latest.every((t) => t.status === 'done')).toBe(true);
  });

  test('rethrows when api rejects without forcing all done', async () => {
    let latest: InstallTask[] = [...INITIAL_INSTALL_TASKS];
    const setInstallTasks: Dispatch<SetStateAction<InstallTask[]>> = (updater) => {
      latest = typeof updater === 'function' ? updater(latest) : updater;
    };

    const err = new Error('setup failed');
    await expect(runInstallProgress(Promise.reject(err), setInstallTasks)).rejects.toThrow(
      'setup failed',
    );
    expect(latest.every((t) => t.status === 'done')).toBe(false);
  });
});
