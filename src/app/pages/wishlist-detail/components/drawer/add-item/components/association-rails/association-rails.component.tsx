import React from 'react';
import { ASSOCIATION_RAIL_MIN_WIDTH } from '../../constants/association-rail-min-width.constant';
import type { Props } from './interfaces/props.interface';
import { AssociationRailsTemplate } from './association-rails.html';

export const AssociationRails: React.FC<Props> = ({
  inlineOnMobile = false,
  linkableItems,
  linkedItemIds,
  relatedItemIds,
  setLinkedItemIds,
  setRelatedItemIds,
  onItemTaggedClick,
  isLinkingModeActive,
  isRelatingModeActive,
  readOnly = false,
}) => {
  const showLinked = isLinkingModeActive || linkedItemIds.length > 0;
  const showRelated = isRelatingModeActive || relatedItemIds.length > 0;
  const relatedEdgeOffset =
    !inlineOnMobile && showLinked && showRelated ? ASSOCIATION_RAIL_MIN_WIDTH : undefined;

  const handleRemoveLinkedId = (id: string) => {
    setLinkedItemIds((prev) => prev.filter((lid) => lid !== id));
  };

  const handleRemoveRelatedId = (id: string) => {
    setRelatedItemIds((prev) => prev.filter((rid) => rid !== id));
  };

  return (
    <AssociationRailsTemplate
      inlineOnMobile = {
        inlineOnMobile
      }
      linkableItems = {
        linkableItems
      }
      linkedItemIds = {
        linkedItemIds
      }
      relatedItemIds = {
        relatedItemIds
      }
      onRemoveLinkedId = {
        readOnly ? undefined : handleRemoveLinkedId
      }
      onRemoveRelatedId = {
        readOnly ? undefined : handleRemoveRelatedId
      }
      onItemClick = {
        readOnly ? undefined : onItemTaggedClick
      }
      isLinkingModeActive = {
        isLinkingModeActive
      }
      isRelatingModeActive = {
        isRelatingModeActive
      }
      relatedEdgeOffset = {
        relatedEdgeOffset
      }
    />
  );
};
