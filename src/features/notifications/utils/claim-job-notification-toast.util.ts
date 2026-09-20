import { CLAIMED_JOB_NOTIFICATION_TOASTS } from '../constants/claimed-job-notification-toasts.constant';

export function claimJobNotificationToast(jobId: string, status?: string): boolean {
  if (CLAIMED_JOB_NOTIFICATION_TOASTS.has(jobId)) return false;
  const key = status ? `${jobId}:${status}` : jobId;
  if (CLAIMED_JOB_NOTIFICATION_TOASTS.has(key)) return false;
  CLAIMED_JOB_NOTIFICATION_TOASTS.add(key);
  CLAIMED_JOB_NOTIFICATION_TOASTS.add(jobId);
  return true;
}

/** Mark a job as handled on the wishlist page so notification toasts are skipped. */
export function markJobNotificationHandled(jobId: string): void {
  CLAIMED_JOB_NOTIFICATION_TOASTS.add(jobId);
}

/** Test-only helper */
export function clearJobNotificationToasts(): void {
  CLAIMED_JOB_NOTIFICATION_TOASTS.clear();
}
