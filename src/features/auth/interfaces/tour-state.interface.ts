export const TOUR_CHAPTER_IDS = [
  'demo',
  'beginner',
  'importAi',
  'listTools',
  'shareDeep',
  'friendsDeep',
  'notifications',
  'theming',
] as const;

export type TourChapterId = (typeof TOUR_CHAPTER_IDS)[number];

export type TourChapterStatus = 'pending' | 'completed' | 'skipped';

export interface TourState {
  FirstRunDismissed: boolean;
  Chapters: Partial<Record<TourChapterId, TourChapterStatus>>;
}

export const EMPTY_TOUR_STATE: TourState = {
  FirstRunDismissed: false,
  Chapters: {},
};
