import { Item } from './item.interface';

export interface AddItemFormProps {
  listId: string;
  isOwner: boolean;
  onSuccess: () => void;
  existingCategories?: string[];
  item?: Item | null;
}
