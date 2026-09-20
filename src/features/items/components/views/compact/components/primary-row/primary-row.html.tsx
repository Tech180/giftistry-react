import React from 'react';
import { Star, Link2, Layers2 } from 'lucide-react';
import {
  Badges,
  ClaimBadge,
  SuggestionBadge,
  SharingAvatars,
  TaggingSelect,
  QuantityBadge,
  PriorityDisplay,
  SubstitutionCounterBadge,
  SubstitutionBadge,
} from '../../../../item-presentation';
import type { Props } from './interfaces/props.interface';

export const PrimaryRowTemplate: React.FC<Props> = ({
  item,
  displayItem,
  canCollaborate,
  isFavorite,
  toggleFavorite,
  hasPriority,
  leadingCol,
  selectCol,
  titleCol,
  relationsCol,
  audienceGroupCol,
  quantityCol,
  priceCol,
  reserveSelect,
  reserveRelations,
  reserveAudienceGroup,
  reserveQuantity,
  isTaggingModeActive,
  isTaggedSelection,
  onSelectTag,
  hasSubstitutionBrowse,
  substitutionIndex,
  substitutionTotal,
  substitutionActiveKind,
  substitutionActiveOption,
  badgesAudienceLabel,
  isPrivate,
  isLinkedToItems,
  isRelatedToItems,
  showSharingAvatars,
  sharingUsers,
  isOwner,
  showClaimBadge,
  claimBadgeEntries,
  suggestedByDisplayName,
  showQuantityBadge,
  metadata,
  primaryPriceLabel,
  primaryClassName,
  starClassName,
  starBtnClassName,
  priorityInlineClassName,
  mainClassName,
  titleClassName,
  subBadgesClassName,
  metaSubClassName,
  linkedIconClassName,
  priceValueClassName,
}) => (
  <div className={primaryClassName}>
    <div
      className={leadingCol.className}
      data-col="leading"
      {...(leadingCol.measure ? { 'data-col-measure': 'leading' } : {})}
    >
      <div className={starClassName}>
        {canCollaborate ? (
          <button
            type="button"
            onClick={toggleFavorite}
            className={starBtnClassName}
            title="Toggle favorite"
          >
            <Star
              size={16}
              fill={isFavorite ? 'var(--warning)' : 'none'}
              stroke={isFavorite ? 'var(--warning)' : 'currentColor'}
            />
          </button>
        ) : isFavorite ? (
          <Star size={16} fill="var(--warning)" stroke="var(--warning)" />
        ) : (
          <Star
            size={16}
            fill="none"
            stroke="currentColor"
            style={{ opacity: 0.3 }}
          />
        )}
        {hasPriority ? (
          <PriorityDisplay
            priority={item.Priority as number}
            variant="compact"
            className={priorityInlineClassName}
          />
        ) : null}
      </div>
    </div>

    {reserveSelect && (
      <div
        className={selectCol.className}
        data-col="select"
        {...(selectCol.measure ? { 'data-col-measure': 'select' } : {})}
      >
        {isTaggingModeActive ? (
          <TaggingSelect
            isTaggingModeActive={isTaggingModeActive}
            isTaggedSelection={isTaggedSelection}
            onSelectTag={onSelectTag}
          />
        ) : null}
      </div>
    )}

    <div className={titleCol.className}>
      <div className={mainClassName}>
        <span className={titleClassName} title={displayItem.Name}>
          {displayItem.Name}
        </span>
        {hasSubstitutionBrowse ? (
          <div className={subBadgesClassName}>
            {substitutionActiveKind !== 'original' ? (
              <SubstitutionBadge
                kind={substitutionActiveKind}
                createdByUserId={substitutionActiveOption?.CreatedByUserId}
              />
            ) : null}
            <SubstitutionCounterBadge
              activeIndex={substitutionIndex}
              total={substitutionTotal}
              isOriginal={substitutionActiveKind === 'original'}
            />
          </div>
        ) : null}
        <div className={metaSubClassName}>
          <Badges
            item={item}
            audienceLabel={badgesAudienceLabel}
            isPrivate={isPrivate}
            showPriority={false}
          />
        </div>
      </div>
    </div>

    {reserveRelations && (
      <div
        className={relationsCol.className}
        data-col="relations"
        {...(relationsCol.measure ? { 'data-col-measure': 'relations' } : {})}
      >
        {isLinkedToItems && (
          <Link2
            size={14}
            className={linkedIconClassName}
            aria-label="Linked to other items"
          />
        )}
        {isRelatedToItems && (
          <Layers2
            size={14}
            className={linkedIconClassName}
            aria-label="Related to other items"
          />
        )}
      </div>
    )}

    {reserveAudienceGroup && (
      <div
        className={audienceGroupCol.className}
        data-col="audience"
        {...(audienceGroupCol.measure ? { 'data-col-measure': 'audience' } : {})}
      >
        {showSharingAvatars ? (
          <SharingAvatars users={sharingUsers} isOwner={isOwner} />
        ) : null}
        {showClaimBadge ? <ClaimBadge entries={claimBadgeEntries} /> : null}
        {item.IsSuggestion ? (
          <SuggestionBadge
            userId={item.SuggestedByUserId}
            displayName={suggestedByDisplayName}
          />
        ) : null}
      </div>
    )}

    {reserveQuantity && (
      <div
        className={quantityCol.className}
        data-col="quantity"
        {...(quantityCol.measure ? { 'data-col-measure': 'quantity' } : {})}
      >
        {showQuantityBadge ? (
          <QuantityBadge item={item} metadata={metadata} isOwner={isOwner} />
        ) : null}
      </div>
    )}

    <div
      className={priceCol.className}
      data-col="price"
      {...(priceCol.measure ? { 'data-col-measure': 'price' } : {})}
    >
      {!reserveQuantity && (
        <QuantityBadge item={item} metadata={metadata} isOwner={isOwner} />
      )}
      <span className={priceValueClassName}>{primaryPriceLabel}</span>
    </div>
  </div>
);
