import { ListShare } from 'features/wishlists/interfaces/list-share.interface';

export interface AudiencePickerProps {
  listShares: ListShare[];
  selectedUserIds: string[];
  onChange: (userIds: string[]) => void;
  visibilityMode: 'everyone' | 'restricted' | 'private';
  onVisibilityModeChange: (mode: 'everyone' | 'restricted' | 'private') => void;
  disabled?: boolean;
}
