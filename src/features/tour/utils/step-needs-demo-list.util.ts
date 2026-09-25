import type { TourStepDef } from '../interfaces/step-def.interface';

/** Welcome and chapter-end cards stay on the dashboard; only hands-on demo steps need the sample list. */
export function stepNeedsDemoList(step: TourStepDef | null | undefined): boolean {
  if (!step || step.chapterId !== 'demo') {
    return false;
  }

  return !step.isWelcome && !step.isChapterEnd;
}
