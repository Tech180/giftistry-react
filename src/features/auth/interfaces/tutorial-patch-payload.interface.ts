import type { TourChapterId } from './tour-state.interface';

export interface TutorialPatchPayload {
  FirstRunDismissed?: boolean;
  CompleteChapter?: TourChapterId;
  SkipChapter?: TourChapterId;
  ResetChapter?: TourChapterId;
  ResetAll?: boolean;
}
