import { ListShare } from 'features/wishlists/interfaces/list-share.interface';

export interface AudiencePickerTemplateProps {
  listShares: ListShare[];
  selectedUserIds: string[];
  visibilityMode: 'everyone' | 'restricted' | 'private';
  search: string;
  setSearch: (value: string) => void;
  onVisibilityModeChange: (mode: 'everyone' | 'restricted' | 'private') => void;
  onToggleUser: (userId: string) => void;
  disabled: boolean;
  getDisplayName: (share: ListShare) => string;
  getInitials: (share: ListShare) => string;
  filteredShares: ListShare[];
}
