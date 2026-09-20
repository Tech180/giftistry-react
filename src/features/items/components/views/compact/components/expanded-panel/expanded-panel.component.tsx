import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ExpandedPanelTemplate } from './expanded-panel.html';
import styles from '../../view.module.css';

export const ExpandedPanel: React.FC<Props> = (props) => {
  if (!props.showExpanded) {
    return null;
  }

  return (
    <ExpandedPanelTemplate
      showExpandedMetadata = {
        props.showExpandedMetadata
      }
      hasFundingContent = {
        props.hasFundingContent
      }
      primaryImageUrl = {
        props.primaryImageUrl
      }
      displayDescription = {
        props.displayDescription
      }
      predefinedDisplayEntries = {
        props.predefinedDisplayEntries
      }
      userDefinedEntries = {
        props.userDefinedEntries
      }
      metadataBadgeEmoji = {
        props.metadataBadgeEmoji
      }
      totalExtractedPrice = {
        props.totalExtractedPrice
      }
      totalClaimedAmount = {
        props.totalClaimedAmount
      }
      rootClassName = {
        styles['view__expanded']
      }
      contentClassName = {
        styles['view__expanded-content']
      }
      photoColClassName = {
        styles['view__expanded-photo-col']
      }
      photoClassName = {
        styles['view__expanded-photo']
      }
      detailColClassName = {
        styles['view__expanded-detail-col']
      }
      descClassName = {
        styles['view__expanded-desc']
      }
      metadataClassName = {
        styles['view__expanded-metadata']
      }
      asideClassName = {
        styles['view__expanded-aside']
      }
    />
  );
};
