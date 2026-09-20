import React from 'react';
import { Switch } from 'shared/ui';
import { AudiencePicker } from '../../../audience-picker/audience-picker.component';
import { SubstitutionManager } from '../../../item-presentation/substitution';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './visibility.module.css';

export const VisibilityTemplate: React.FC<TemplateProps> = ({
  canCollaborate,
  isSuggestion,
  isLoading,
  readOnly = false,
  isEdit,
  isHiddenIdea,
  setIsHiddenIdea,
  otherUsersCanSee,
  setOtherUsersCanSee,
  claimOnCreate,
  setClaimOnCreate,
  itemId,
  allowSubstitutions,
  setAllowSubstitutions,
  substitutionOptions,
  onOpenCreateSubstitution,
  onOpenEditSubstitution,
  onDeleteOwnerSubstitution,
  onReorderOwnerSubstitutions,
  listShares,
  sharedWithUserIds,
  setSharedWithUserIds,
  visibilityMode,
  onVisibilityModeChange,
  isSubstitutionSurface,
  isClaimerCustomStrip,
  showClaimOnCreate,
}) => {
  if (!isSubstitutionSurface) {
    if (readOnly) {
      return null;
    }

    return (
      <div className={styles.visibility}>
        <div className={styles['visibility__divider']} />
        <div className={styles['visibility__section']}>
          {canCollaborate && !isSuggestion && (
            <SubstitutionManager
              parentItemId={itemId}
              options={substitutionOptions}
              allowSubstitutions={allowSubstitutions}
              onAllowSubstitutionsChange={setAllowSubstitutions}
              onOpenCreate={onOpenCreateSubstitution}
              onOpenEdit={onOpenEditSubstitution}
              onDelete={onDeleteOwnerSubstitution}
              onReorder={onReorderOwnerSubstitutions}
              disabled={isLoading || readOnly}
            />
          )}

          <AudiencePicker
            listShares={listShares}
            selectedUserIds={sharedWithUserIds}
            onChange={setSharedWithUserIds}
            visibilityMode={visibilityMode}
            onVisibilityModeChange={onVisibilityModeChange}
            disabled={isLoading || readOnly}
          />

          {!canCollaborate && (
            <>
              <div className={styles['visibility__switch-row']}>
                <label htmlFor="visible-to-list-owner" className={styles['visibility__switch-label']}>
                  Visible to list owner
                </label>
                <Switch
                  id="visible-to-list-owner"
                  checked={!isHiddenIdea}
                  onChange={(visible) => setIsHiddenIdea(!visible)}
                  size="sm"
                  aria-label="Visible to list owner"
                />
              </div>

              <div className={styles['visibility__switch-row']}>
                <label
                  htmlFor="visible-to-other-collaborators"
                  className={styles['visibility__switch-label']}
                >
                  Visible to Other Collaborators
                </label>
                <Switch
                  id="visible-to-other-collaborators"
                  checked={otherUsersCanSee}
                  onChange={setOtherUsersCanSee}
                  size="sm"
                  aria-label="Visible to Other Collaborators"
                />
              </div>

              {!isEdit && (
                <div className={styles['visibility__switch-row']}>
                  <label
                    htmlFor="claim-this-item-immediately"
                    className={styles['visibility__switch-label']}
                  >
                    Claim this Item Immediately
                  </label>
                  <Switch
                    id="claim-this-item-immediately"
                    checked={claimOnCreate}
                    onChange={setClaimOnCreate}
                    size="sm"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  if (!isClaimerCustomStrip) {
    return null;
  }

  return (
    <div className={styles.visibility}>
      <div className={styles['visibility__divider']} />
      <div className={styles['visibility__section']}>
        <div className={styles['visibility__switch-row']}>
          <label htmlFor="sub-visible-to-list-owner" className={styles['visibility__switch-label']}>
            Visible to list owner
          </label>
          <Switch
            id="sub-visible-to-list-owner"
            checked={!isHiddenIdea}
            onChange={(visible) => setIsHiddenIdea(!visible)}
            size="sm"
            aria-label="Visible to list owner"
          />
        </div>

        {showClaimOnCreate ? (
          <div className={styles['visibility__switch-row']}>
            <label
              htmlFor="sub-claim-this-item-immediately"
              className={styles['visibility__switch-label']}
            >
              Claim this Item Immediately
            </label>
            <Switch
              id="sub-claim-this-item-immediately"
              checked={claimOnCreate}
              onChange={setClaimOnCreate}
              size="sm"
              aria-label="Claim this Item Immediately"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
