/** Deduplicate job-completion toasts across list WS + notification.received. */
const claimed = new Set<string>();

export function claimJobNotificationToast(jobId: string, status?: string): boolean {
  if (claimed.has(jobId)) return false;
  const key = status ? `${jobId}:${status}` : jobId;
  if (claimed.has(key)) return false;
  claimed.add(key);
  claimed.add(jobId);
  return true;
}

/** Mark a job as handled on the wishlist page so notification toasts are skipped. */
export function markJobNotificationHandled(jobId: string): void {
  claimed.add(jobId);
}

/** Test-only helper */
export function clearJobNotificationToasts(): void {
  claimed.clear();
}
