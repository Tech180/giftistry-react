import type { Item } from './item.interface';

export interface BulkAddResult {
  Created: number;
  Items: Item[];
  Failed: Array<{ Index: number; Message: string }>;
}
