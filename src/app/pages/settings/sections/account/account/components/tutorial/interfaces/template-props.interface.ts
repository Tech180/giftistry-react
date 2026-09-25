import type { TourChapterId } from 'features/auth';
import type { ChapterRow } from './chapter-row.interface';

export interface TemplateProps {
  chapters: ChapterRow[];
  isBusy: boolean;
  onRestartAll: () => void;
  onReplaySample: () => void;
  onStartChapter: (id: TourChapterId) => void;
}
