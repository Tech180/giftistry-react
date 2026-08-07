import type { Item } from 'features/items/interfaces/item.interface';
import type { BackgroundJobView } from './background-job.interface';

export interface ItemEnrichJobResult {
  Job: BackgroundJobView;
  Item?: Item;
}
