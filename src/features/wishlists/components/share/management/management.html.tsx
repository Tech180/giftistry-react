import React from 'react';
import { X } from 'lucide-react';
import { ManagementTemplateProps } from './interfaces/management.interface';
import styles from './management.module.css';

export const ShareManagementTemplate: React.FC<ManagementTemplateProps> = ({
  shares,
  isOwner,
  isLoading,
  error,
  updatingId,
  removingId,
  onRoleChange,
  onRemove,
  getDisplayName,
}) => {
  if (isLoading) {
    return <p className={styles['status-text']}>Loading collaborators...</p>;
  }

  if (error) {
    return <p className={styles['error-text']}>{error}</p>;
  }

  if (shares.length === 0) {
    return <p className={styles['empty-text']}>No collaborators yet. Share this wishlist to get started.</p>;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <ul className={styles.list}>
      {shares.map((share) => {
        const displayName = getDisplayName(share);
        const initials = getInitials(displayName);

        return (
          <li key={share.Id} className={styles['list-item']}>
            <div className={styles['user-info']}>
              <div className={styles.avatar}>{initials}</div>
              <div className={styles['user-details']}>
                <div className={styles['user-name-group']}>
                  <span className={styles['user-name']}>{displayName}</span>
                </div>
                <span className={styles.email}>{share.Email || 'No email'}</span>
              </div>
            </div>
            {isOwner ? (
              <div className={styles.actions}>
                <select
                  value={share.Role}
                  onChange={(e) => onRoleChange(share.Id, e.target.value as 'viewer' | 'collaborator')}
                  disabled={updatingId === share.Id}
                  className={styles['role-select']}
                >
                  <option value="viewer">Can view</option>
                  <option value="collaborator">Can edit</option>
                </select>
                <button
                  type="button"
                  className={styles['remove-btn']}
                  onClick={() => onRemove(share.Id)}
                  disabled={removingId === share.Id}
                  title="Remove access"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <span className={styles['role-badge']}>{share.Role === 'viewer' ? 'Can view' : 'Can edit'}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
