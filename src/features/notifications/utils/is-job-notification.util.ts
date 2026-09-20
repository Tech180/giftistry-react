export function isJobNotification(type: string): boolean {
  return type === 'job_completed' || type === 'job_failed';
}
