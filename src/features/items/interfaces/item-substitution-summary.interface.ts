import type { Claim } from './item-claim.interface';
import type { ItemLink } from './item-link.interface';
import type { ItemPhoto } from './item-photo.interface';
import type { ItemSubstitutionCustomFields } from './item-substitution-custom-fields.interface';
import type { ItemSubstitutionVariation } from './item-substitution-variation.interface';

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
