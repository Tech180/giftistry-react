import type { TourChapterId, TourChapterStatus } from 'features/auth';

export interface ChapterRow {
  id: TourChapterId;
  title: string;
  description: string;
  status: TourChapterStatus;
  disabled?: boolean;
  disabledReason?: string;
}
