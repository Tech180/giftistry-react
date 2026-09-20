import { Wishlist } from '../../../interfaces/wishlist.interface';

export interface Props {
  onSuccess: (wishlist: Wishlist) => void;
  onCancel?: () => void;
}
