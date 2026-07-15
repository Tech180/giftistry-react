/** Deduplicate terminal import toasts across strip + wishlist-detail. */
const notified = new Set<string>();

export function claimImportJobTerminalToast(jobId: string, status: string): boolean {
  const key = `${jobId}:${status}`;
  if (notified.has(key)) return false;
  notified.add(key);
  return true;
}

/** Test-only helper */
export function clearImportJobTerminalToasts(): void {
  notified.clear();
}
