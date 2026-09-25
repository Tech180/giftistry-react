import { describe, expect, test } from 'vitest';
import { isDemoListId, isDemoListPath } from './is-demo-list-id.util';
import { TOUR_DEMO_LIST_ID } from '../constants/targets.constant';

describe('isDemoListId', () => {
  test('matches tour demo list id', () => {
    expect(isDemoListId(TOUR_DEMO_LIST_ID)).toBe(true);
    expect(isDemoListId('other')).toBe(false);
    expect(isDemoListId(null)).toBe(false);
    expect(isDemoListId(undefined)).toBe(false);
  });
});

describe('isDemoListPath', () => {
  test('matches demo wishlist routes', () => {
    expect(isDemoListPath(`/wishlists/${TOUR_DEMO_LIST_ID}`)).toBe(true);
    expect(isDemoListPath(`/wishlists/${TOUR_DEMO_LIST_ID}/extra`)).toBe(true);
    expect(isDemoListPath('/wishlists/real-id')).toBe(false);
    expect(isDemoListPath('/dashboard')).toBe(false);
  });
});
