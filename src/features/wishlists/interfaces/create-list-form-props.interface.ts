import { Wishlist } from './wishlist.interface';

export interface CreateListFormProps {
  onSuccess: (wishlist: Wishlist) => void;
}
