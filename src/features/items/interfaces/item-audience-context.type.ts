import type { Item } from './item.interface';

export type ItemAudienceContext = Pick<Item, 'SharedWith' | 'SuggestedByUserId'>;
