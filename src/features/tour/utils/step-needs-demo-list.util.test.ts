import { describe, expect, it } from 'vitest';
import { TOUR_STEPS } from '../constants/steps.constant';
import { stepNeedsDemoList } from './step-needs-demo-list.util';

describe('stepNeedsDemoList', () => {
  it('keeps welcome and chapter-end off the sample list', () => {
    const welcome = TOUR_STEPS.find((step) => step.id === 'demo-welcome');
    const done = TOUR_STEPS.find((step) => step.id === 'demo-done');
    const beginner = TOUR_STEPS.find((step) => step.id === 'beginner-welcome');

    expect(stepNeedsDemoList(welcome)).toBe(false);
    expect(stepNeedsDemoList(done)).toBe(false);
    expect(stepNeedsDemoList(beginner)).toBe(false);
  });

  it('requires the sample list for in-list demo steps', () => {
    const grid = TOUR_STEPS.find((step) => step.id === 'demo-grid');
    expect(stepNeedsDemoList(grid)).toBe(true);
  });
});
