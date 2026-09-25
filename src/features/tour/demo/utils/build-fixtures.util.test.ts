import { describe, expect, test } from 'vitest';
import { TOUR_DEMO_LIST_ID } from '../../constants/targets.constant';
import { buildSeedComments } from './build-comments.util';
import { buildJordanItem, buildSeedItems } from './build-items.util';
import { buildWishlist } from './build-wishlist.util';

describe('demo fixture builders', () => {
  test('builds a sample wishlist owned by the current user', () => {
    const wishlist = buildWishlist('user-1', 'Alex');
    expect(wishlist.Id).toBe(TOUR_DEMO_LIST_ID);
    expect(wishlist.UserId).toBe('user-1');
    expect(wishlist.Title).toContain('Alex');
    expect(wishlist.Shares?.length).toBe(2);
  });

  test('seed items and jordan item use the demo list id', () => {
    const items = buildSeedItems(TOUR_DEMO_LIST_ID);
    expect(items).toHaveLength(2);
    expect(buildJordanItem(TOUR_DEMO_LIST_ID).Id).toBe('tour-demo-item-jordan');
    expect(buildSeedComments(TOUR_DEMO_LIST_ID)[0].Username).toBe('Jordan');
  });
});
