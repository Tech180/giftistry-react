import type { Item } from './item.interface';

export interface ResolveClaimerSubstitutionActionInput {
  item: Pick<Item, 'Id' | 'SubstitutionOptions' | 'IsSuggestion' | 'AllowSubstitutions'>;
  userId: string | null | undefined;
  canCollaborate: boolean;
  isPublicGuest: boolean;
}
