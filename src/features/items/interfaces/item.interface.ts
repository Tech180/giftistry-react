import { ItemLink } from './item-link.interface';
import { Claim } from './item-claim.interface';
import { ItemAudienceUser } from './item-audience-user.interface';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';

export interface Item {
  Id: string;
  ListId: string;
  PriorityId: string | null;
  SuggestedByUserId: string | null;
  SuggestedByUsername?: string | null;
  Name: string;
  Description: string | null;
  IsHiddenIdea: boolean;
  IsSuggestion?: boolean;
  Category: string;
  CategoryKey?: string;
  CategoryLabel?: string;
  Priority?: number | null;
  CreatedAt?: string;
  SharedWith?: ItemAudienceUser[];
  Links: ItemLink[];
  Claims: Claim[];
  IsClaimed: boolean;
  Metadata?: ItemDescriptionMetadata | null;
  IsFullyClaimed?: boolean;
  IsMultiCount?: boolean;
  TotalClaimedAmount?: number;
  TotalClaimedQuantity?: number;
  DesiredQuantity?: number | null;
  RemainingQuantity?: number | null;
  FundingTarget?: number;
}
