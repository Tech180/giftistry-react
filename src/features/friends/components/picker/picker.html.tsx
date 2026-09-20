import React from 'react';
import { Check } from 'lucide-react';
import { UserPreviewCard } from 'features/auth';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './picker.module.css';

export const PickerTemplate: React.FC<TemplateProps> = ({
  friends,
  selectedIds,
  onToggle,
  getDisplayName,
  getFriendUserId,
}) => {
  if (friends.length === 0) {
    return <p className={styles['picker__empty']}>No friends to share with. Add friends first!</p>;
  }

  return (
    <ul className={styles['picker']}>
      {friends.map((friend) => {
        const userId = getFriendUserId(friend);
        const displayName = getDisplayName(friend);
        const isSelected = selectedIds.includes(userId);

        return (
          <li key={friend.Id}>
            <button
              type="button"
              className={[
                styles['picker__item'],
                isSelected ? styles['picker__item--selected'] : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onToggle(userId)}
            >
              <span
                className={[
                  styles['picker__checkbox'],
                  isSelected ? styles['picker__checkbox--checked'] : '',
                ].filter(Boolean).join(' ')}
              >
                {isSelected ? <Check size={12} strokeWidth={3} /> : null}
              </span>
              <UserPreviewCard
                userId = {
                  userId
                }
                displayName = {
                  displayName
                }
              >
                <span className={styles['picker__name']}>{displayName}</span>
              </UserPreviewCard>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
