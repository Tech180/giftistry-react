import { describe, expect, test } from 'vitest';
import type { ListFilterContext } from '../interfaces/list-filter-context.interface';
import { resolveListFilterCapabilities } from './resolve-list-filter-capabilities.util';

const base: ListFilterContext = {
  allowGroupFunds: true,
  revealSuggestions: true,
  currentUserId: 'u1',
  listOwnerUserId: 'owner',
  isOwner: false,
  canCollaborate: false,
  isPublicGuest: false,
};

describe('resolveListFilterCapabilities', () => {
  test('shows availability and suggestions-only filters only for shared viewers', () => {
    expect(resolveListFilterCapabilities(base).showAvailabilityFilter).toBe(true);
    expect(resolveListFilterCapabilities(base).showSuggestionsType).toBe(true);
    expect(
      resolveListFilterCapabilities({ ...base, isOwner: true, canCollaborate: true })
        .showAvailabilityFilter
    ).toBe(false);
    expect(
      resolveListFilterCapabilities({ ...base, isOwner: true, canCollaborate: true })
        .showSuggestionsType
    ).toBe(false);
    expect(
      resolveListFilterCapabilities({ ...base, canCollaborate: true }).showAvailabilityFilter
    ).toBe(false);
    expect(
      resolveListFilterCapabilities({ ...base, canCollaborate: true }).showSuggestionsType
    ).toBe(false);
    expect(
      resolveListFilterCapabilities({ ...base, isPublicGuest: true }).showAvailabilityFilter
    ).toBe(false);
    expect(
      resolveListFilterCapabilities({ ...base, isPublicGuest: true }).showSuggestionsType
    ).toBe(false);
    expect(
      resolveListFilterCapabilities({ ...base, revealSuggestions: false }).showSuggestionsType
    ).toBe(false);
    expect(
      resolveListFilterCapabilities({ ...base, revealSuggestions: false }).showAvailabilityFilter
    ).toBe(true);
  });

  test('shows partial quantity filter only for shared viewers', () => {
    expect(resolveListFilterCapabilities(base).showPartialQuantity).toBe(true);
    expect(
      resolveListFilterCapabilities({ ...base, isOwner: true, canCollaborate: true })
        .showPartialQuantity
    ).toBe(false);
    expect(
      resolveListFilterCapabilities({ ...base, canCollaborate: true }).showPartialQuantity
    ).toBe(false);
    expect(
      resolveListFilterCapabilities({ ...base, isPublicGuest: true }).showPartialQuantity
    ).toBe(false);
  });

  test('shows common list filters for owners, collaborators, and viewers', () => {
    const viewer = resolveListFilterCapabilities(base);
    const owner = resolveListFilterCapabilities({ ...base, isOwner: true, canCollaborate: true });
    const collaborator = resolveListFilterCapabilities({ ...base, canCollaborate: true });

    for (const caps of [viewer, owner, collaborator]) {
      expect(caps.showEnrichFilters).toBe(true);
      expect(caps.showFavorites).toBe(true);
    }
  });

  test('shows added-by for signed-in users but not public guests', () => {
    expect(resolveListFilterCapabilities(base).showAddedBy).toBe(true);
    expect(
      resolveListFilterCapabilities({ ...base, isPublicGuest: true }).showAddedBy
    ).toBe(false);
  });
});
