import React, { useCallback, useMemo, useState } from 'react';
import { AudiencePickerProps } from './interfaces/audience-picker-props.interface';
import { AudiencePickerTemplate } from './audience-picker.html';
import { getAudienceDisplayName } from '../../utils/item-audience.util';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';

export const AudiencePicker: React.FC<AudiencePickerProps> = ({
  listShares,
  selectedUserIds,
  onChange,
  visibilityMode,
  onVisibilityModeChange,
  disabled = false,
}) => {
  const [search, setSearch] = useState('');

  const getDisplayName = useCallback((share: ListShare) => getAudienceDisplayName(share), []);

  const getInitials = useCallback((share: ListShare) => {
    if (share.FirstName || share.LastName) {
      return `${share.FirstName?.[0] || ''}${share.LastName?.[0] || ''}`.toUpperCase();
    }
    return share.Username?.substring(0, 2).toUpperCase() || '??';
  }, []);

  const filteredShares = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return listShares;
    return listShares.filter((share) => {
      const name = getDisplayName(share).toLowerCase();
      const email = share.Email?.toLowerCase() || '';
      return name.includes(query) || email.includes(query);
    });
  }, [listShares, search, getDisplayName]);

  const handleToggleUser = useCallback(
    (userId: string) => {
      if (selectedUserIds.includes(userId)) {
        onChange(selectedUserIds.filter((id) => id !== userId));
      } else {
        onChange([...selectedUserIds, userId]);
      }
    },
    [selectedUserIds, onChange]
  );

  return (
    <AudiencePickerTemplate
      listShares={listShares}
      selectedUserIds={selectedUserIds}
      visibilityMode={visibilityMode}
      search={search}
      setSearch={setSearch}
      onVisibilityModeChange={onVisibilityModeChange}
      onToggleUser={handleToggleUser}
      disabled={disabled}
      getDisplayName={getDisplayName}
      getInitials={getInitials}
      filteredShares={filteredShares}
    />
  );
};
