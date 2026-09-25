import { describe, expect, it } from 'vitest';
import { TOUR_CHAPTERS } from '../constants/chapters.constant';
import { buildChapterProgressBar } from './chapter-progress-bar.util';

const beginnerSteps = [
  { id: 'beginner-welcome', isWelcome: true },
  { id: 'beginner-create' },
  { id: 'beginner-title' },
  { id: 'beginner-submit' },
  { id: 'beginner-done', isChapterEnd: true },
];

describe('buildChapterProgressBar', () => {
  it('fills by index within countable steps (demo math)', () => {
    const progress = buildChapterProgressBar({
      eligibleChapters: TOUR_CHAPTERS,
      activeChapterId: 'beginner',
      steps: beginnerSteps,
      activeStepId: 'beginner-title',
    });

    // countable: create, title, submit — title is index 1 → 1/3
    expect(progress).toEqual({
      chapterIndex: 1,
      chapterCount: TOUR_CHAPTERS.length,
      chapterTitle: 'Create your list',
      chapterFillPercent: (1 / 3) * 100,
    });
  });

  it('starts the chapter empty on the first countable step', () => {
    const progress = buildChapterProgressBar({
      eligibleChapters: TOUR_CHAPTERS,
      activeChapterId: 'beginner',
      steps: beginnerSteps,
      activeStepId: 'beginner-create',
    });

    expect(progress?.chapterFillPercent).toBe(0);
  });

  it('fills the chapter fully on chapter-end', () => {
    const progress = buildChapterProgressBar({
      eligibleChapters: TOUR_CHAPTERS,
      activeChapterId: 'beginner',
      steps: beginnerSteps,
      activeStepId: 'beginner-done',
    });

    expect(progress?.chapterFillPercent).toBe(100);
  });

  it('returns undefined when the chapter is not eligible', () => {
    expect(
      buildChapterProgressBar({
        eligibleChapters: TOUR_CHAPTERS.filter((chapter) => chapter.id !== 'demo'),
        activeChapterId: 'demo',
        steps: [{ id: 'demo-grid' }],
        activeStepId: 'demo-grid',
      })
    ).toBeUndefined();
  });

  it('treats a chapter with no countable steps as fully filled', () => {
    const progress = buildChapterProgressBar({
      eligibleChapters: TOUR_CHAPTERS,
      activeChapterId: 'demo',
      steps: [{ id: 'demo-welcome', isWelcome: true }],
      activeStepId: 'demo-welcome',
    });

    expect(progress?.chapterFillPercent).toBe(100);
  });
});
