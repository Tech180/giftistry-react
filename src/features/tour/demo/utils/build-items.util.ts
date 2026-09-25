import type { Item } from 'features/items';
import { USER_JORDAN } from '../constants/users.constant';

export const DEMO_JORDAN_ITEM_ID = 'tour-demo-item-jordan';

function item(partial: Partial<Item> & Pick<Item, 'Id' | 'ListId' | 'Name'>): Item {
  return {
    PriorityId: null,
    SuggestedByUserId: null,
    Description: null,
    IsHiddenIdea: false,
    Category: 'generic',
    Links: [],
    Claims: [],
    IsClaimed: false,
    ...partial,
  };
}

export function buildSeedItems(listId: string): Item[] {
  return [
    item({
      Id: 'tour-demo-item-1',
      ListId: listId,
      Name: 'Wireless headphones',
      Description: 'Noise-cancelling over-ear',
      Priority: 2,
    }),
    item({
      Id: 'tour-demo-item-2',
      ListId: listId,
      Name: 'Cookbook',
      Description: 'Weeknight dinners',
      Priority: 3,
    }),
  ];
}

export function buildJordanItem(listId: string): Item {
  return item({
    Id: DEMO_JORDAN_ITEM_ID,
    ListId: listId,
    Name: 'Ceramic pour-over set',
    Description: 'Added by Jordan',
    Priority: 2,
    SuggestedByUserId: USER_JORDAN,
    SuggestedByUsername: 'Jordan',
    SuggestedByFirstName: 'Jordan',
    SuggestedByLastName: 'Lee',
  });
}
