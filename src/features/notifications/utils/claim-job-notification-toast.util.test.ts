import { beforeEach, describe, expect, it } from 'vitest';
import {
  claimJobNotificationToast,
  clearJobNotificationToasts,
  markJobNotificationHandled,
} from './claim-job-notification-toast.util';

describe('claimJobNotificationToast', () => {
  beforeEach(() => {
    clearJobNotificationToasts();
  });

  it('allows the first claim and blocks duplicates', () => {
    expect(claimJobNotificationToast('job-1', 'job_completed')).toBe(true);
    expect(claimJobNotificationToast('job-1', 'job_completed')).toBe(false);
  });

  it('blocks toast after markJobNotificationHandled', () => {
    markJobNotificationHandled('job-2');
    expect(claimJobNotificationToast('job-2', 'job_completed')).toBe(false);
  });
});
