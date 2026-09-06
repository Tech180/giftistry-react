import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type { ItemLink } from './item-link.interface';
import type { ItemPhoto } from './item-photo.interface';
import type { Claim } from './item-claim.interface';

export type ItemSubstitutionKind = 'owner_approved' | 'claimer_custom';

export interface ItemSubstitutionCustomFields {
  Predefined?: Record<string, string | null>;
  UserDefined?: Record<string, string>;
}

export interface ItemSubstitutionVariation {
  Name: string;
  Quantity: number;
}

export interface ItemSubstitutionSummary {
  Id: string;
  Name: string;
  Description: string | null;
  Category?: string;
  PriorityId?: string | null;
  Priority?: number | null;
  IsHiddenIdea?: boolean;
  IsFavorite?: boolean;
  IsPinned?: boolean;
  DesiredQuantity?: number | null;
  MultiCount?: boolean;
  CustomFields?: ItemSubstitutionCustomFields | null;
  Variations?: ItemSubstitutionVariation[] | null;
  Links: ItemLink[];
  Photos: ItemPhoto[];
  Claims: Claim[];
  IsClaimed: boolean;
  IsFullyClaimed?: boolean;
  FundingTarget?: number;
  TotalClaimedAmount?: number;
  TotalClaimedQuantity?: number;
  RemainingQuantity?: number | null;
}

export interface ItemSubstitutionOption {
  Id: string;
  Kind: ItemSubstitutionKind;
  SortOrder: number;
  CreatedByUserId: string;
  Item: ItemSubstitutionSummary;
}

export interface CreateSubstitutionPayload {
  Name: string;
  Description?: string | null;
  LinkUrl?: string | null;
  Price?: number | null;
  WebsiteName?: string | null;
  Category?: string | null;
  PriorityId?: string | null;
  Priority?: number | null;
  /** Claimer custom: hide from list owner when true. */
  IsHiddenIdea?: boolean | null;
  Metadata?: ItemDescriptionMetadata | null;
}
