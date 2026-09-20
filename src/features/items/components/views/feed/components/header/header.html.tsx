import React from 'react';
import { Link2, Link as LinkIcon, Layers2 } from 'lucide-react';
import {
  Badges,
  ClaimBadge,
  SuggestionBadge,
  TaggingSelect,
  QuantityBadge,
  PriorityDisplay,
} from '../../../../item-presentation';
import type { TemplateProps } from './interfaces/template-props.interface';

export const HeaderTemplate: React.FC<TemplateProps> = ({
  item,
  displayItem,
  isOwner,
  audienceLabel,
  isPrivate,
  isTaggingModeActive,
  isTaggedSelection,
  onSelectTag,
  isLinkedToItems,
  isRelatedToItems,
  primaryLink,
  primaryPrice,
  showQuantity,
  claimBadgeEntries,
  showClaimBadge,
  suggestedByDisplayName,
  hasPriority,
  metadata,
  getSiteName,
  headerClassName,
  titleWrapClassName,
  titleRowClassName,
  titleClassName,
  linkedIconClassName,
  badgesClassName,
  headerMetaClassName,
  headerLinkClassName,
  priceRowClassName,
  priceClassName,
}) => (
  <header className={headerClassName}>
    <div className={titleWrapClassName}>
      <div className={titleRowClassName}>
        {isTaggingModeActive ? (
          <TaggingSelect
            isTaggingModeActive = {
              !!isTaggingModeActive
            }
            isTaggedSelection = {
              !!isTaggedSelection
            }
            onSelectTag = {
              onSelectTag
            }
          />
        ) : null}
        <h3 className={titleClassName}>
          {isLinkedToItems ? (
            <Link2 size={16} className={linkedIconClassName} aria-hidden="true" />
          ) : null}
          {isRelatedToItems ? (
            <Layers2
              size={16}
              className={linkedIconClassName}
              aria-label="Related to other items"
            />
          ) : null}
          {displayItem.Name}
        </h3>
      </div>
      <div className={badgesClassName}>
        <Badges
          item = {
            item
          }
          audienceLabel = {
            audienceLabel
          }
          isPrivate = {
            isPrivate
          }
          showPriority = {
            false
          }
        />
      </div>
    </div>
    <div className={headerMetaClassName}>
      {primaryLink ? (
        <a
          href={primaryLink.Url}
          target="_blank"
          rel="noopener noreferrer"
          className={headerLinkClassName}
        >
          <LinkIcon size={14} aria-hidden="true" />
          {getSiteName(primaryLink.Url, primaryLink.RetailerName)}
        </a>
      ) : null}
      {primaryPrice != null || showClaimBadge || showQuantity ? (
        <div className={priceRowClassName}>
          <QuantityBadge
            item = {
              item
            }
            metadata = {
              metadata
            }
            isOwner = {
              isOwner
            }
          />
          {primaryPrice != null ? (
            <span className={priceClassName}>${primaryPrice}</span>
          ) : null}
          {showClaimBadge ? (
            <ClaimBadge
              entries = {
                claimBadgeEntries
              }
            />
          ) : null}
          {item.IsSuggestion ? (
            <SuggestionBadge
              userId = {
                item.SuggestedByUserId
              }
              displayName = {
                suggestedByDisplayName
              }
            />
          ) : null}
        </div>
      ) : null}
      {hasPriority ? (
        <PriorityDisplay
          priority = {
            item.Priority as number
          }
          variant = {
            'meta'
          }
        />
      ) : null}
    </div>
  </header>
);
