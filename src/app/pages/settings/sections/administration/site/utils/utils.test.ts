import { describe, expect, test } from 'vitest';
import { displayInviteListUrl, displayInviteUrl } from './display-invite-url.util';
import { getInviteStatusSummary } from './get-invite-status-summary.util';
import { inviteStatusBadgeLabel } from './invite-status-badge-label.util';

describe('getInviteStatusSummary', () => {
  test('returns loading when status is missing', () => {
    expect(getInviteStatusSummary(null)).toBe('Loading invite status…');
  });

  test('pluralizes active invites', () => {
    expect(
      getInviteStatusSummary({
        HasActiveInvite: true,
        IsExpired: false,
        IsCompleted: false,
        ExpiresAt: null,
        MaxUses: null,
        UseCount: 0,
        CreatedAt: null,
        Invites: [
          {
            Id: '1',
            Url: 'https://x',
            Status: 'active',
            ExpiresAt: '',
            MaxUses: 1,
            UseCount: 0,
            CreatedAt: '',
          },
        ],
      })
    ).toBe('1 active invite link');

    expect(
      getInviteStatusSummary({
        HasActiveInvite: true,
        IsExpired: false,
        IsCompleted: false,
        ExpiresAt: null,
        MaxUses: null,
        UseCount: 0,
        CreatedAt: null,
        Invites: [
          {
            Id: '1',
            Url: 'https://x',
            Status: 'active',
            ExpiresAt: '',
            MaxUses: 1,
            UseCount: 0,
            CreatedAt: '',
          },
          {
            Id: '2',
            Url: 'https://y',
            Status: 'active',
            ExpiresAt: '',
            MaxUses: 1,
            UseCount: 0,
            CreatedAt: '',
          },
        ],
      })
    ).toBe('2 active invite links');
  });
});

describe('displayInviteUrl', () => {
  test('strips protocol from invite url', () => {
    expect(displayInviteUrl('https://example.com/invite', false)).toBe('example.com/invite');
    expect(displayInviteUrl('http://example.com/invite', false)).toBe('example.com/invite');
  });

  test('falls back when no url', () => {
    expect(displayInviteUrl(null, true)).toBe('Generate a link to copy it here');
    expect(displayInviteUrl(null, false)).toBe('No invite link yet');
  });
});

describe('displayInviteListUrl', () => {
  test('strips protocol or returns unavailable', () => {
    expect(displayInviteListUrl('https://example.com/x')).toBe('example.com/x');
    expect(displayInviteListUrl(null)).toBe('Link unavailable');
  });
});

describe('inviteStatusBadgeLabel', () => {
  test('maps statuses', () => {
    expect(inviteStatusBadgeLabel('active')).toBe('Active');
    expect(inviteStatusBadgeLabel('completed')).toBe('Completed');
    expect(inviteStatusBadgeLabel('expired')).toBe('Expired');
  });
});
