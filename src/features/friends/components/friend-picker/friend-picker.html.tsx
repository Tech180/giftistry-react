import React from 'react';
import { Check } from 'lucide-react';
import { UserPreviewCard } from 'shared/ui';
import { FriendPickerTemplateProps } from './interfaces/friend-picker-template-props.interface';
import styles from './friend-picker.module.css';

export const FriendPickerTemplate: React.FC<FriendPickerTemplateProps> = ({
  friends,
  selectedIds,
  onToggle,
  getDisplayName,
  getFriendUserId,
}) => {
  if (friends.length === 0) {
    return <p className={styles['empty-text']}>No friends to share with. Add friends first!</p>;
  }

  return (
    <ul className={styles.list}>
      {friends.map((friend) => {
        const userId = getFriendUserId(friend);
        const displayName = getDisplayName(friend);
        const isSelected = selectedIds.includes(userId);

        return (
          <li key={friend.Id}>
            <button
              type="button"
              className={`${styles['picker-item']} ${isSelected ? styles.selected : ''}`}
              onClick={() => onToggle(userId)}
            >
              <span className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}>
                {isSelected && <Check size={12} strokeWidth={3} />}
              </span>
              <UserPreviewCard userId={userId} displayName={displayName}>
                <span className={styles['friend-name']}>{displayName}</span>
              </UserPreviewCard>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
