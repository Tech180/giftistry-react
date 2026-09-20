import type { Item } from './item.interface';

export type FundingSource = Pick<Item, 'FundingTarget' | 'TotalClaimedAmount' | 'Links' | 'Claims'>;
