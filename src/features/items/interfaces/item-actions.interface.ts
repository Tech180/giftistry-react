import { Claim } from './item-claim.interface';
import { Item } from './item.interface';
import { ItemLink } from './item-link.interface';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type {
  CreateSubstitutionPayload,
  ItemSubstitutionOption,
} from './item-substitution.interface';

export interface ClaimItemParams {
  itemId: string;
  amount?: number | null;
  claimedByName?: string | null;
  anonymous?: boolean;
  quantity?: number;
  selection?: string | null;
  includeLinked?: boolean;
}

export interface ItemActions {
  updateItem: (
    itemId: string,
    name: string,
    description?: string | null,
    priorityId?: string | null,
    category?: string | null,
    priority?: number | null,
    sharedWithUserIds?: string[],
    linkUrl?: string | null,
    price?: number | null,
    websiteName?: string | null,
    metadata?: ItemDescriptionMetadata | null,
    isHiddenIdea?: boolean
  ) => Promise<Item>;
  addItemLink: (itemId: string, url: string) => Promise<ItemLink>;
  claimItem: (params: ClaimItemParams) => Promise<Claim | Claim[]>;
  claimItems: (requests: ClaimItemParams[]) => Promise<Claim[]>;
  unclaimItem: (
    itemId: string,
    userId?: string | null,
    includeLinked?: boolean
  ) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  createOwnerSubstitution?: (
    parentItemId: string,
    payload: CreateSubstitutionPayload
  ) => Promise<ItemSubstitutionOption>;
  createClaimerSubstitution?: (
    parentItemId: string,
    payload: CreateSubstitutionPayload
  ) => Promise<ItemSubstitutionOption>;
  updateSubstitution?: (
    parentItemId: string,
    substitutionId: string,
    payload: CreateSubstitutionPayload
  ) => Promise<ItemSubstitutionOption>;
  deleteSubstitution?: (parentItemId: string, substitutionId: string) => Promise<void>;
  reorderOwnerSubstitutions?: (
    parentItemId: string,
    orderedIds: string[]
  ) => Promise<void>;
}
