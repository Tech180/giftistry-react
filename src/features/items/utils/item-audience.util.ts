import { ItemAudienceUser } from '../interfaces/item-audience-user.interface';
import { Item } from '../interfaces/item.interface';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';

type ItemAudienceContext = Pick<Item, 'SharedWith' | 'SuggestedByUserId'>;

export type ItemAudienceMode = 'everyone' | 'restricted' | 'private';

export interface LinkingAudienceContext {
  mode: ItemAudienceMode;
  sharedWithUserIds: string[];
}

export function getItemAudienceMode(item: ItemAudienceContext): ItemAudienceMode {
  const sharedWith = item.SharedWith;
  if (!sharedWith || sharedWith.length === 0) {
    return 'everyone';
  }
  if (isSelfPrivateItem(item)) {
    return 'private';
  }
  return 'restricted';
}

export function getAudienceSharedUserIds(item: ItemAudienceContext): string[] {
  if (!item.SharedWith || item.SharedWith.length === 0) {
    return [];
  }
  return [...item.SharedWith.map((u) => u.UserId)].sort();
}

export function audiencesAreCompatible(
  sourceMode: ItemAudienceMode,
  sourceSharedIds: string[],
  targetMode: ItemAudienceMode,
  targetSharedIds: string[]
): boolean {
  if (sourceMode !== targetMode) {
    return false;
  }
  if (sourceMode !== 'restricted') {
    return true;
  }
  if (sourceSharedIds.length !== targetSharedIds.length) {
    return false;
  }
  return sourceSharedIds.every((id, index) => id === targetSharedIds[index]);
}

export function canLinkItemsByAudience(
  source: LinkingAudienceContext,
  target: ItemAudienceContext
): boolean {
  const targetMode = getItemAudienceMode(target);
  const targetSharedIds = getAudienceSharedUserIds(target);
  const sourceSharedIds = [...source.sharedWithUserIds].sort();
  return audiencesAreCompatible(source.mode, sourceSharedIds, targetMode, targetSharedIds);
}

export function buildLinkingAudienceContext(
  visibilityMode: 'everyone' | 'restricted' | 'private',
  sharedWithUserIds: string[],
  ownerUserId?: string
): LinkingAudienceContext {
  if (visibilityMode === 'private' && ownerUserId) {
    return { mode: 'private', sharedWithUserIds: [ownerUserId] };
  }
  if (visibilityMode === 'restricted') {
    return { mode: 'restricted', sharedWithUserIds: [...sharedWithUserIds].sort() };
  }
  return { mode: 'everyone', sharedWithUserIds: [] };
}

export function linkingContextFromItem(item: ItemAudienceContext): LinkingAudienceContext {
  return {
    mode: getItemAudienceMode(item),
    sharedWithUserIds: getAudienceSharedUserIds(item),
  };
}

export const LINK_AUDIENCE_MISMATCH_MESSAGE =
  'Linked items must use the same visibility: Everyone, Only Me, or the same specific people.';

export function isSelfPrivateItem(item: ItemAudienceContext): boolean {
  const sharedWith = item.SharedWith;
  return !!(
    sharedWith &&
    sharedWith.length === 1 &&
    item.SuggestedByUserId &&
    sharedWith[0].UserId === item.SuggestedByUserId
  );
}

export function isPrivateItem(
  item: ItemAudienceContext,
  currentUserId?: string
): boolean {
  return (
    isSelfPrivateItem(item) &&
    !!currentUserId &&
    item.SuggestedByUserId === currentUserId
  );
}

export function isRestrictedItem(item: Pick<Item, 'SharedWith'>): boolean {
  const sharedWith = item.SharedWith;
  if (!sharedWith || sharedWith.length === 0) {
    return false;
  }
  return sharedWith.length > 1;
}

export function canViewItem(
  item: ItemAudienceContext,
  currentUserId?: string,
  isOwner?: boolean
): boolean {
  const sharedWith = item.SharedWith;
  if (!sharedWith || sharedWith.length === 0) {
    return true;
  }

  if (isSelfPrivateItem(item)) {
    return !!(currentUserId && item.SuggestedByUserId === currentUserId);
  }

  if (isOwner) {
    return true;
  }

  const isSuggester = !!(currentUserId && item.SuggestedByUserId === currentUserId);
  if (isSuggester) {
    return true;
  }

  return !!(currentUserId && sharedWith.some((u) => u.UserId === currentUserId));
}

export function getAudienceDisplayName(user: ItemAudienceUser | ListShare): string {
  const first = user.FirstName?.trim();
  const last = user.LastName?.trim();
  if (first || last) {
    return `${first || ''} ${last || ''}`.trim();
  }
  return user.Username || user.Email || 'User';
}

export function formatAudienceLabel(
  sharedWith: ItemAudienceUser[] | undefined,
  currentUserId?: string,
  isOwner?: boolean,
  suggestedByUserId?: string | null
): string | null {
  if (!sharedWith || sharedWith.length === 0) {
    return null;
  }

  if (
    sharedWith.length === 1 &&
    currentUserId &&
    suggestedByUserId &&
    sharedWith[0].UserId === suggestedByUserId &&
    currentUserId === suggestedByUserId
  ) {
    return 'Only Me';
  }

  if (!isOwner && currentUserId && sharedWith.some(u => u.UserId === currentUserId)) {
    return 'Shared with you';
  }

  const names = sharedWith.map(getAudienceDisplayName);
  return `Shared with: ${names.join(', ')}`;
}

export function formatAudienceForExport(
  sharedWith: ItemAudienceUser[] | undefined,
  currentUserId?: string,
  suggestedByUserId?: string | null
): string {
  if (!sharedWith || sharedWith.length === 0) {
    return 'Everyone';
  }
  if (
    sharedWith.length === 1 &&
    currentUserId &&
    suggestedByUserId &&
    sharedWith[0].UserId === suggestedByUserId &&
    currentUserId === suggestedByUserId
  ) {
    return 'Only Me';
  }
  return sharedWith.map(getAudienceDisplayName).join(', ');
}

export function formatSuggestionForExport(
  item: Pick<Item, 'IsHiddenIdea' | 'IsSuggestion' | 'SuggestedByUsername'>,
  isOwner: boolean
): string {
  if (isOwner) {
    return '';
  }
  if (item.IsSuggestion) {
    return `Suggestion by ${item.SuggestedByUsername || 'Collaborator'}`;
  }
  if (item.IsHiddenIdea) {
    return 'Hidden suggestion';
  }
  return '';
}
