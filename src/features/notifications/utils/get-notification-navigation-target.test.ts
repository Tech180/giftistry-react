import { describe, expect, it } from 'vitest';
import { getNotificationNavigationTarget } from './get-notification-navigation-target';
import type { Notification } from '../interfaces/notification.interface';

const base = (overrides: Partial<Notification>): Notification => ({
  Id: 'n1',
  UserId: 'u1',
  Type: 'system',
  Title: 'Title',
  Message: 'Message',
  IsRead: false,
  CreatedAt: new Date().toISOString(),
  ...overrides,
});

describe('getNotificationNavigationTarget', () => {
  it('routes job_completed to the wishlist', () => {
    expect(
      getNotificationNavigationTarget(
        base({
          Type: 'job_completed',
          Metadata: { ListId: 'list-42', JobId: 'job-1' },
        })
      )
    ).toBe('/wishlists/list-42');
  });

  it('routes job_failed to the wishlist', () => {
    expect(
      getNotificationNavigationTarget(
        base({
          Type: 'job_failed',
          Metadata: { ListId: 'list-9' },
        })
      )
    ).toBe('/wishlists/list-9');
  });

  it('routes item_deleted to the wishlist', () => {
    expect(
      getNotificationNavigationTarget(
        base({
          Type: 'item_deleted',
          Metadata: { ListId: 'list-77', ItemName: 'Alt Gift' },
        })
      )
    ).toBe('/wishlists/list-77');
  });
});
