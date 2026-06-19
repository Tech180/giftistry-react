import { ItemLink } from './item-link.interface';
import { Claim } from './item-claim.interface';

export interface Item {
  Id: string;
  ListId: string;
  PriorityId: string | null;
  SuggestedByUserId: string | null;
  Name: string;
  Description: string | null;
  IsHiddenIdea: boolean;
  Category: string;
  CreatedAt?: string;
  Links: ItemLink[];
  Claims: Claim[];
  IsClaimed: boolean;
}
