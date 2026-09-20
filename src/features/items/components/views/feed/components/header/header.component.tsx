import React from 'react';
import type { Props } from './interfaces/props.interface';
import { HeaderTemplate } from './header.html';
import styles from '../../view.module.css';

export const Header: React.FC<Props> = (props) => {
  const headerMetaClassName = [
    styles['view__header-meta'],
    props.elevateAboveWash ? styles['view__header-meta--above-wash'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <HeaderTemplate
      item = {
        props.item
      }
      displayItem = {
        props.displayItem
      }
      isOwner = {
        props.isOwner
      }
      audienceLabel = {
        props.audienceLabel
      }
      isPrivate = {
        props.isPrivate
      }
      isTaggingModeActive = {
        props.isTaggingModeActive
      }
      isTaggedSelection = {
        props.isTaggedSelection
      }
      onSelectTag = {
        props.onSelectTag
      }
      isLinkedToItems = {
        props.isLinkedToItems
      }
      isRelatedToItems = {
        props.isRelatedToItems
      }
      primaryLink = {
        props.primaryLink
      }
      primaryPrice = {
        props.primaryPrice
      }
      showQuantity = {
        props.showQuantity
      }
      claimBadgeEntries = {
        props.claimBadgeEntries
      }
      showClaimBadge = {
        props.showClaimBadge
      }
      suggestedByDisplayName = {
        props.suggestedByDisplayName
      }
      hasPriority = {
        props.hasPriority
      }
      metadata = {
        props.metadata
      }
      getSiteName = {
        props.getSiteName
      }
      headerClassName = {
        styles['view__header']
      }
      titleWrapClassName = {
        styles['view__title-wrap']
      }
      titleRowClassName = {
        styles['view__title-row']
      }
      titleClassName = {
        styles['view__title']
      }
      linkedIconClassName = {
        styles['view__linked-icon']
      }
      badgesClassName = {
        styles['view__badges']
      }
      headerMetaClassName = {
        headerMetaClassName
      }
      headerLinkClassName = {
        styles['view__header-link']
      }
      priceRowClassName = {
        styles['view__price-row']
      }
      priceClassName = {
        styles['view__price']
      }
    />
  );
};
