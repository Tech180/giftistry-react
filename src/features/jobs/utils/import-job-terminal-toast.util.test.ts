import { beforeEach, describe, expect, test } from 'vitest';
import {
  claimImportJobTerminalToast,
  clearImportJobTerminalToasts,
} from './import-job-terminal-toast.util';

describe('claimImportJobTerminalToast', () => {
  beforeEach(() => {
    clearImportJobTerminalToasts();
  });

  test('allows only one toast per jobId+status', () => {
    expect(claimImportJobTerminalToast('job-1', 'completed')).toBe(true);
    expect(claimImportJobTerminalToast('job-1', 'completed')).toBe(false);
    expect(claimImportJobTerminalToast('job-1', 'failed')).toBe(true);
  });
});
