import { ItemAudienceUser } from '../../../../interfaces/item-audience-user.interface';

export interface Props {
  users: ItemAudienceUser[];
  isOwner?: boolean;
}
