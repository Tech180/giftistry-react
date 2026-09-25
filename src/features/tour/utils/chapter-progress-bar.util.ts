import type { SpotlightProgress } from 'shared/ui';
import type { TourChapterDef } from '../constants/chapters.constant';

export interface ChapterProgressStep {
  id: string;
  isWelcome?: boolean;
  isChapterEnd?: boolean;
}

export interface ChapterProgressBarInput {
  eligibleChapters: TourChapterDef[];
  activeChapterId: string;
  steps: ChapterProgressStep[];
  activeStepId: string;
}

/**
 * Segmented chapter progress matching the demo tour bar:
 * completed chapters full, current chapter filled by index / countable steps,
 * welcome + chapter-end excluded from the fill denominator.
 */
export function buildChapterProgressBar(input: ChapterProgressBarInput): SpotlightProgress | undefined {
  const { eligibleChapters, activeChapterId, steps, activeStepId } = input;
  const chapterIndex = eligibleChapters.findIndex((chapter) => chapter.id === activeChapterId);
  if (chapterIndex < 0 || eligibleChapters.length === 0) {
    return undefined;
  }

  const chapter = eligibleChapters[chapterIndex];
  const countable = steps.filter((step) => !step.isWelcome && !step.isChapterEnd);
  const active = steps.find((step) => step.id === activeStepId);
  let indexInChapter = countable.findIndex((step) => step.id === activeStepId);

  if (active?.isChapterEnd) {
    indexInChapter = countable.length;
  }

  const chapterFillPercent =
    countable.length > 0
      ? Math.min(100, Math.max(0, (Math.max(0, indexInChapter) / countable.length) * 100))
      : 100;

  return {
    chapterIndex,
    chapterCount: eligibleChapters.length,
    chapterTitle: chapter.title,
    chapterFillPercent,
  };
}
