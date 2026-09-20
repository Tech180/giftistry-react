import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';
import { TaggingOverlay, SubstitutionSwitcher } from '../../item-presentation';
import { ExpandedPanel } from './components/expanded-panel/expanded-panel.component';
import { ClaimSection } from './components/claim-section/claim-section.component';
import { PrimaryRow } from './components/primary-row/primary-row.component';
import { SecondaryRow } from './components/secondary-row/secondary-row.component';

export const ViewTemplate: React.FC<TemplateProps> = (props) => {
  const {
    item,
    displayItem = item,
    substitutionOptions,
    substitutionActiveIndex,
    onSubstitutionIndexChange,
    substitutionAction = null,
    isClaimUnavailable,
    claimUserId,
    claimActorName,
    linkedClaimPeers = [],
    wishlistItemsForLinkedClaim = [],
    isTaggingModeActive,
    onSelectTag,
    isExpanded,
    hasExpandableContent,
    rootClassName,
    switcherClassName,
    innerClassName,
    bodyClassName,
    rowClassName,
    onRootMouseEnter,
    onRootMouseLeave,
    onCompactRowClick,
    onCompactRowKeyDown,
    compactRowRole,
    compactRowTabIndex,
    actionBtnConfirmClassName,
    actionBtnConfirmPrimaryClassName,
  } = props;

  return (
    <div
      className={rootClassName}
      data-testid="item-card-view"
      aria-expanded={hasExpandableContent ? isExpanded : undefined}
      onMouseEnter={onRootMouseEnter}
      onMouseLeave={onRootMouseLeave}
    >
      <TaggingOverlay
        isTaggingModeActive={!!isTaggingModeActive}
        onSelectTag={onSelectTag}
      />

      <SubstitutionSwitcher
        parent={item}
        options={substitutionOptions}
        userId={claimUserId}
        activeIndex={substitutionActiveIndex}
        onActiveIndexChange={onSubstitutionIndexChange}
        className={switcherClassName}
      >
        {(active) => (
          <div className={innerClassName}>
            <div className={bodyClassName}>
              <div
                className={rowClassName}
                onClick={onCompactRowClick}
                role={compactRowRole}
                tabIndex={compactRowTabIndex}
                onKeyDown={onCompactRowKeyDown}
              >
                <PrimaryRow
                  {...props}
                  displayItem = {
                    displayItem
                  }
                  substitutionActiveKind = {
                    active.kind
                  }
                  substitutionActiveOption = {
                    active.option
                  }
                />

                <SecondaryRow
                  {...props}
                  substitutionAction = {
                    substitutionAction
                  }
                  showClaimForm = {
                    props.showClaimForm
                  }
                  canAdjustClaim = {
                    props.canAdjustClaim ?? false
                  }
                  isClaimUnavailable = {
                    !!isClaimUnavailable
                  }
                />
              </div>

              <ClaimSection
                {...props}
                displayItem = {
                  displayItem
                }
                claimUserId = {
                  claimUserId ?? null
                }
                claimActorName = {
                  claimActorName ?? null
                }
                linkedClaimPeers = {
                  linkedClaimPeers
                }
                wishlistItemsForLinkedClaim = {
                  wishlistItemsForLinkedClaim
                }
                actionBtnClassName = {
                  actionBtnConfirmClassName
                }
                actionBtnPrimaryClassName = {
                  actionBtnConfirmPrimaryClassName
                }
              />

              <ExpandedPanel
                {...props}
              />
            </div>
          </div>
        )}
      </SubstitutionSwitcher>
    </div>
  );
};
