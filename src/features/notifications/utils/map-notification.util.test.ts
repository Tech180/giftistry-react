import { describe, expect, it } from 'vitest';
import { mapNotification } from './map-notification.util';

describe('mapNotification', () => {
  it('maps ReadAt null to IsRead false', () => {
    const mapped = mapNotification({
      Id: 'n1',
      UserId: 'u1',
      Type: 'friend_request',
      Title: 'Hello',
      Message: 'World',
      ReadAt: null,
      CreatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect(mapped.IsRead).toBe(false);
    expect(mapped.Message).toBe('World');
  });

  it('maps ReadAt present to IsRead true', () => {
    const mapped = mapNotification({
      Id: 'n1',
      UserId: 'u1',
      Type: 'friend_request',
      Title: 'Hello',
      Message: null,
      ReadAt: '2026-01-02T00:00:00.000Z',
      CreatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect(mapped.IsRead).toBe(true);
    expect(mapped.Message).toBe('');
  });

  it('preserves explicit IsRead when present', () => {
    const mapped = mapNotification({
      Id: 'n1',
      UserId: 'u1',
      Type: 'job_completed',
      Title: 'Done',
      IsRead: false,
      ReadAt: '2026-01-02T00:00:00.000Z',
      CreatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect(mapped.IsRead).toBe(false);
  });

  it('stringifies metadata values', () => {
    const mapped = mapNotification({
      Id: 'n1',
      UserId: 'u1',
      Type: 'job_completed',
      Title: 'Done',
      CreatedAt: new Date('2026-01-01T00:00:00.000Z'),
      Metadata: { JobId: 'j1', Count: 3 as unknown as string },
    });
    expect(mapped.Metadata).toEqual({ JobId: 'j1', Count: '3' });
    expect(mapped.CreatedAt).toBe('2026-01-01T00:00:00.000Z');
  });
});
