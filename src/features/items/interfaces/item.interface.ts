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
  CreatedAt?: string;
  Links: ItemLink[];
  Claims: Claim[];
  IsClaimed: boolean;
}
