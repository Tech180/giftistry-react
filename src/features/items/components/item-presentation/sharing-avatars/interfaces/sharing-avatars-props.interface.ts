import { ItemAudienceUser } from '../../../../interfaces/item-audience-user.interface';

export interface SharingAvatarsProps {
  users: ItemAudienceUser[];
  isOwner?: boolean;
}
