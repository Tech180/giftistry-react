import React from 'react';
import { Button } from 'shared/ui';
import { SubstitutionSlot } from './components/substitution-slot/substitution-slot.component';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ClaimFooterTemplate: React.FC<TemplateProps> = ({
  mode,
  showOwnerActions,
  showClaimForm,
  claimForm,
  ownerActions,
  substitutionAction,
  substitutionManageIconClassName,
  claimLoading,
  claimedByCurrentUser,
  primaryButtonLabel,
  primaryButtonVariant,
  unclaimLabel,
  unavailableLabel,
  onOpenClaimForm,
  onUnclaim,
  footerActionsClassName,
  claimWidgetClassName,
  claimButtonClassName,
  unclaimButtonClassName,
}) => {
  if (mode === 'hidden') {
    return null;
  }

  if (mode === 'owner-only') {
    return <>{ownerActions}</>;
  }

  if (mode === 'unavailable') {
    return (
      <>
        {showOwnerActions ? ownerActions : null}
        <div className={footerActionsClassName}>
          <SubstitutionSlot
            substitutionAction = {
              substitutionAction
            }
            claimLoading = {
              claimLoading
            }
            substitutionManageIconClassName = {
              substitutionManageIconClassName
            }
          />
          <Button
            variant = {
              'secondary'
            }
            className = {
              claimButtonClassName
            }
            disabled
          >
            {unavailableLabel}
          </Button>
        </div>
      </>
    );
  }

  if (mode === 'unclaim') {
    return (
      <>
        {showOwnerActions ? ownerActions : null}
        <div className={footerActionsClassName}>
          <SubstitutionSlot
            substitutionAction = {
              substitutionAction
            }
            claimLoading = {
              claimLoading
            }
            substitutionManageIconClassName = {
              substitutionManageIconClassName
            }
          />
          <Button
            variant = {
              'secondary'
            }
            className = {
              claimButtonClassName
            }
            onClick = {
              onUnclaim
            }
            isLoading = {
              claimLoading
            }
          >
            {unclaimLabel}
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {showOwnerActions ? ownerActions : null}
      <div className={claimWidgetClassName}>
        {showClaimForm ? (
          claimForm
        ) : (
          <div className={footerActionsClassName}>
            <SubstitutionSlot
              substitutionAction = {
                substitutionAction
              }
              claimLoading = {
                claimLoading
              }
              substitutionManageIconClassName = {
                substitutionManageIconClassName
              }
            />
            {mode === 'quantity' && claimedByCurrentUser ? (
              <Button
                variant = {
                  'ghost'
                }
                className = {
                  unclaimButtonClassName
                }
                onClick = {
                  onUnclaim
                }
                isLoading = {
                  claimLoading
                }
              >
                Unclaim All
              </Button>
            ) : null}
            <Button
              variant = {
                primaryButtonVariant
              }
              className = {
                claimButtonClassName
              }
              onClick = {
                onOpenClaimForm
              }
            >
              {primaryButtonLabel}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
