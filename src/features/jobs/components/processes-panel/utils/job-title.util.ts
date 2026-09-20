import type { BackgroundJobView } from '../../../interfaces/background-job.interface';

export function jobTitle(job: BackgroundJobView): string {
  return job.FileName?.trim() || 'Wishlist import';
}
