import React from 'react';
import { Check } from 'lucide-react';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import { COMMENT_VISIBILITY_EVERYONE_LABEL } from '../../../../constants/comment-visibility-labels.constant';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './visibility-panel.module.css';

export const VisibilityPanelTemplate: React.FC<TemplateProps> = ({
  isMobile,
  panelClassName,
  isEveryoneActive,
  showSpoilerWarning,
  showHiddenFromOwner,
  isHiddenFromOwnerActive,
  isChooseWhoActive,
  isChooseWhoEnabled,
  chooseWhoDisabledHelp,
  audienceRows,
  onSelectMode,
  onToggleUser,
  onDone,
  panelRef,
}) => {
  const body = (
    <div
      ref={panelRef}
      className={panelClassName}
      role="dialog"
      aria-label="Comment visibility"
    >
      <h3 className={styles.title}>Who can see this?</h3>

      <button
        type="button"
        className={`${styles.option} ${isEveryoneActive ? styles['option--active'] : ''}`}
        onClick={() => onSelectMode('visibleToAll')}
        aria-pressed={isEveryoneActive}
      >
        <span className={styles['option-label']}>{COMMENT_VISIBILITY_EVERYONE_LABEL}</span>
        <span className={styles['option-help']}>Everyone with list access can see this.</span>
      </button>

      {showSpoilerWarning ? (
        <p className={styles.warning}>
          The list owner will be able to read this comment. Surprises may be spoiled.
        </p>
      ) : null}

      {showHiddenFromOwner ? (
        <button
          type="button"
          className={`${styles.option} ${isHiddenFromOwnerActive ? styles['option--active'] : ''}`}
          onClick={() => onSelectMode('hiddenFromOwner')}
          aria-pressed={isHiddenFromOwnerActive}
        >
          <span className={styles['option-label']}>Invisible to Owner</span>
          <span className={styles['option-help']}>
            Everyone on the list except the owner can see this.
          </span>
        </button>
      ) : null}

      <button
        type="button"
        className={[
          styles.option,
          isChooseWhoActive ? styles['option--active'] : '',
          !isChooseWhoEnabled ? styles['option--disabled'] : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => {
          if (!isChooseWhoEnabled) {
            return;
          }
          onSelectMode('visibleToSelected');
        }}
        disabled={!isChooseWhoEnabled}
        aria-disabled={!isChooseWhoEnabled}
        aria-pressed={isChooseWhoActive}
        tabIndex={isChooseWhoEnabled ? 0 : -1}
      >
        <span className={styles['option-label']}>Choose who can see</span>
        <span className={styles['option-help']}>
          {isChooseWhoEnabled
            ? 'Only selected people (and you) can see this. @mentions add them automatically.'
            : chooseWhoDisabledHelp}
        </span>
      </button>

      {isChooseWhoActive ? (
        <div className={styles.audience}>
          <p className={styles['audience-hint']}>Mention adds to audience</p>
          {audienceRows.map((row) => (
            <button
              key={row.userId}
              type="button"
              className={`${styles['audience-row']} ${row.checked ? styles['audience-row--checked'] : ''}`}
              onClick={() => onToggleUser(row.userId)}
              aria-pressed={row.checked}
            >
              <span className={styles['audience-meta']}>
                <span className={styles['audience-name']}>{row.name}</span>
                <span className={styles['role-chip']}>{row.roleLabel}</span>
              </span>
              {row.checked ? <Check size={14} aria-hidden /> : null}
            </button>
          ))}
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
