import type { TourResumeState } from '../interfaces/resume-state.interface';
import { TOUR_STEP_STORAGE_KEY } from '../constants/storage-keys.constant';
import { TOUR_CHAPTER_IDS, type TourChapterId } from 'features/auth';

export function readTourResume(): TourResumeState | null {
  try {
    const raw = localStorage.getItem(TOUR_STEP_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as TourResumeState;
    if (!parsed?.chapterId || !parsed?.stepId) {
      return null;
    }

    if (!(TOUR_CHAPTER_IDS as readonly string[]).includes(parsed.chapterId)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function writeTourResume(state: TourResumeState): void {
  localStorage.setItem(TOUR_STEP_STORAGE_KEY, JSON.stringify(state));
}

export function clearTourResume(): void {
  localStorage.removeItem(TOUR_STEP_STORAGE_KEY);
}

export function isTourChapterId(value: string): value is TourChapterId {
  return (TOUR_CHAPTER_IDS as readonly string[]).includes(value);
}
