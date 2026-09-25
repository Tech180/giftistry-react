import React from 'react';
import { Check } from 'lucide-react';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './visibility-panel.module.css';

function roleLabel(
  participant: { userId: string; role?: string },
  listOwnerId?: string
): string {
  if (participant.role) {
    return participant.role;
  }

  if (listOwnerId && participant.userId === listOwnerId) {
    return 'owner';
  }

  return 'member';
}

export const VisibilityPanelTemplate: React.FC<TemplateProps> = ({
  isMobile,
  isOwner,
  mode,
  selectedUserIds,
  participants,
  currentUserId,
  listOwnerId,
  onSelectMode,
  onToggleUser,
  onDone,
  panelRef,
}) => {
  const panelClass = [
    styles.panel,
    isMobile ? styles['panel--sheet'] : styles['panel--dropdown'],
  ].join(' ');

  const showAudience = isOwner || mode === 'visibleToSelected';
  const chooseWhoActive = isOwner || mode === 'visibleToSelected';

  const body = (
    <div
      ref={isMobile ? panelRef : undefined}
      className={panelClass}
      role="dialog"
      aria-label="Comment visibility"
    >
      <h3 className={styles.title}>Who can see this?</h3>

      {!isOwner ? (
        <>
          <button
            type="button"
            className={`${styles.option} ${mode === 'hiddenFromOwner' ? styles['option--active'] : ''}`}
            onClick={() => onSelectMode('hiddenFromOwner')}
            aria-pressed={mode === 'hiddenFromOwner'}
          >
            <span className={styles['option-label']}>Invisible to Owner</span>
            <span className={styles['option-help']}>
              Everyone on the list except the owner can see this.
            </span>
          </button>

          <button
            type="button"
            className={`${styles.option} ${mode === 'visibleToAll' ? styles['option--active'] : ''}`}
            onClick={() => onSelectMode('visibleToAll')}
            aria-pressed={mode === 'visibleToAll'}
          >
            <span className={styles['option-label']}>Visible to Owner</span>
            <span className={styles['option-help']}>Everyone with list access can see this.</span>
          </button>

          {mode === 'visibleToAll' ? (
            <p className={styles.warning}>
              The list owner will be able to read this comment. Surprises may be spoiled.
            </p>
          ) : null}
        </>
      ) : null}

      <button
        type="button"
        className={`${styles.option} ${chooseWhoActive ? styles['option--active'] : ''}`}
        onClick={() => onSelectMode('visibleToSelected')}
        aria-pressed={chooseWhoActive}
      >
        <span className={styles['option-label']}>Choose who can see</span>
        <span className={styles['option-help']}>
          Only selected people (and you) can see this. @mentions add them automatically.
        </span>
      </button>

      {showAudience ? (
        <div className={styles.audience}>
          <p className={styles['audience-hint']}>Mention adds to audience</p>
          {participants.map((participant) => {
            const isAuthor = participant.userId === currentUserId;
            const checked = isAuthor || selectedUserIds.includes(participant.userId);
            return (
              <button
                key={participant.userId}
                type="button"
                className={`${styles['audience-row']} ${checked ? styles['audience-row--checked'] : ''}`}
                onClick={() => {
                  if (!isAuthor) {
                    onToggleUser(participant.userId);
                  }
                }}
                disabled={isAuthor}
                aria-pressed={checked}
              >
                <span className={styles['audience-meta']}>
                  <span className={styles['audience-name']}>
                    {participant.displayName || participant.username}
                    {isAuthor ? ' (you)' : ''}
                  </span>
                  <span className={styles['role-chip']}>
                    {roleLabel(participant, listOwnerId)}
                  </span>
                </span>
                {checked ? <Check size={14} aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      ) : null}

      <button type="button" className={styles.done} onClick={onDone}>
        Done
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          className={styles['sheet-dismiss']}
          aria-label="Close visibility picker"
          onClick={onDone}
        />
        <EnterPanel animation="slide-up">{body}</EnterPanel>
      </>
    );
  }

  return <EnterPanel animation="dropdown">{body}</EnterPanel>;
};
