import React from 'react';
import { Link as LinkIcon, Pencil, Trash2, Eye } from 'lucide-react';
import { SubstitutionClaimButton } from '../../../../item-presentation';
import type { TemplateProps } from './interfaces/template-props.interface';

export const TrailingActionsTemplate: React.FC<TemplateProps> = ({
  trailingCol,
  primaryLink,
  primaryLinkTitle,
  primaryLinkAriaLabel,
  onView,
  showCompactActions,
  canShowEditActions,
  onEdit,
  setShowDeleteConfirm,
  showGuestClaimActions,
  claimActionsClassName,
  useSyncedClaimActionWidth,
  substitutionAction,
  claimLoading,
  showClaimForm,
  claimedByCurrentUser,
  canAdjustClaim,
  handleUnclaim,
  setShowClaimForm,
  isClaimUnavailable,
  isFullyClaimed,
  unclaimLabel,
  actionsClassName,
  actionBtnDangerClassName,
  trailingClassName,
  linkClassName,
  actionBtnClassName,
  actionBtnClaimClassName,
  actionBtnClaimDangerClassName,
  actionIconClassName,
}) => (
  <div
    className={trailingCol.className}
    data-col="trailing"
    {...(trailingCol.measure ? { 'data-col-measure': 'trailing' } : {})}
  >
    <div className={trailingClassName}>
      {primaryLink ? (
        <div className={linkClassName}>
          <a
            href={primaryLink.Url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={primaryLinkTitle}
            aria-label={primaryLinkAriaLabel}
            className={actionBtnClassName}
          >
            <LinkIcon size={14} className={actionIconClassName} aria-hidden />
          </a>
        </div>
      ) : null}

      {(onView || showCompactActions) ? (
        <div className={actionsClassName}>
          {onView ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className={actionBtnClassName}
              title="View Item"
              aria-label="View item"
            >
              <Eye size={14} className={actionIconClassName} />
            </button>
          ) : null}
          {canShowEditActions ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className={actionBtnClassName}
                title="Edit Item"
                aria-label="Edit item"
              >
                <Pencil size={14} className={actionIconClassName} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className={actionBtnDangerClassName}
                title="Delete Item"
                aria-label="Delete item"
              >
                <Trash2 size={14} className={actionIconClassName} />
              </button>
            </>
          ) : null}
          {showGuestClaimActions ? (
            <div
              className={claimActionsClassName}
              {...(useSyncedClaimActionWidth
                ? { 'data-col-measure': 'claimActions' }
                : {})}
            >
              {substitutionAction ? (
                <SubstitutionClaimButton
                  mode = {
                    substitutionAction.mode
                  }
                  allowSubstitutions = {
                    substitutionAction.allowSubstitutions
                  }
                  onOpenEditor = {
                    substitutionAction.onRequest
                  }
                  onDelete = {
                    substitutionAction.onDelete
                  }
                  appearance = {
                    'ghost-text'
                  }
                  size = {
                    'sm'
                  }
                  disabled = {
                    claimLoading || showClaimForm
                  }
                  className = {
                    actionBtnClaimClassName
                  }
                />
              ) : null}
              {claimedByCurrentUser && !canAdjustClaim ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnclaim();
                  }}
                  disabled={claimLoading}
                  className={actionBtnClaimClassName}
                >
                  {unclaimLabel}
                </button>
              ) : claimedByCurrentUser && canAdjustClaim ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnclaim();
                    }}
                    disabled={claimLoading}
                    className={actionBtnClaimDangerClassName}
                  >
                    Unclaim All
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowClaimForm(true);
                    }}
                    className={actionBtnClaimClassName}
                  >
                    Update
                  </button>
                </>
              ) : isClaimUnavailable ? (
                <button type="button" className={actionBtnClaimClassName} disabled>
                  Unavailable
                </button>
              ) : isFullyClaimed ? (
                <button type="button" className={actionBtnClaimClassName} disabled>
                  Claimed
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowClaimForm(true);
                  }}
                  className={actionBtnClaimClassName}
                >
                  Claim
                </button>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  </div>
);
