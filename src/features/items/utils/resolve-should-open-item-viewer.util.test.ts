import { describe, expect, it } from 'vitest';
import { resolveShouldOpenItemViewer } from './resolve-should-open-item-viewer.util';

describe('resolveShouldOpenItemViewer', () => {
  it('returns false for owners', () => {
    expect(
      resolveShouldOpenItemViewer({
        isOwner: true,
        canCollaborate: true,
        isPublicGuest: false,
      })
    ).toBe(false);
  });

  it('returns false for collaborators', () => {
    expect(
      resolveShouldOpenItemViewer({
        isOwner: false,
        canCollaborate: true,
        isPublicGuest: false,
      })
    ).toBe(false);
  });

  it('returns true for viewers', () => {
    expect(
      resolveShouldOpenItemViewer({
        isOwner: false,
        canCollaborate: false,
        isPublicGuest: false,
      })
    ).toBe(true);
  });

  it('returns true for public guests', () => {
    expect(
      resolveShouldOpenItemViewer({
        isOwner: false,
        canCollaborate: false,
        isPublicGuest: true,
      })
    ).toBe(true);
  });

  it('returns true for public guests even if owner flags are true', () => {
    expect(
      resolveShouldOpenItemViewer({
        isOwner: true,
        canCollaborate: true,
        isPublicGuest: true,
      })
    ).toBe(true);
  });
});
