import React from 'react';
import { MiniDrawer } from 'features/items';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './association-rails.module.css';

export const AssociationRailsTemplate: React.FC<TemplateProps> = ({
  inlineOnMobile,
  linkableItems,
  linkedItemIds,
  relatedItemIds,
  onRemoveLinkedId,
  onRemoveRelatedId,
  onItemClick,
  isLinkingModeActive,
  isRelatingModeActive,
  relatedEdgeOffset,
}) => {
  return (
    <div className={styles['association-rails']}>
      <MiniDrawer
        items = {
          linkableItems
        }
        selectedIds = {
          linkedItemIds
        }
        onRemoveId = {
          onRemoveLinkedId
        }
        onItemClick = {
          onItemClick
        }
        isActive = {
          isLinkingModeActive
        }
        position = {
          'left'
        }
        label = {
          'Linked'
        }
        inlineOnMobile = {
          inlineOnMobile
        }
      />
      <MiniDrawer
        items = {
          linkableItems
        }
        selectedIds = {
          relatedItemIds
        }
        onRemoveId = {
          onRemoveRelatedId
        }
        onItemClick = {
          onItemClick
        }
        isActive = {
          isRelatingModeActive
        }
        position = {
          'left'
        }
        label = {
          'Related'
        }
        inlineOnMobile = {
          inlineOnMobile
        }
        edgeOffset = {
          relatedEdgeOffset
        }
      />
    </div>
  );
};
