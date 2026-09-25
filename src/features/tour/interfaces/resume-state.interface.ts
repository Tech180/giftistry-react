import type { TourChapterId } from 'features/auth';

export interface TourResumeState {
  chapterId: TourChapterId;
  stepId: string;
  createdListId?: string;
}
