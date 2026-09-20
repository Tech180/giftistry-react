import React from 'react';
import type { Props } from './interfaces/props.interface';
import { CardTemplate } from './card.html';
import styles from '../../showcase.module.css';

export const CardBody: React.FC<Props> = (props) => {
  return (
    <CardTemplate
      {...props}
      statusBadgeClassName = {
        styles['status-badge']
      }
      starClassName = {
        styles['detail-star-icon']
      }
      headerClassName = {
        styles['showcase-header']
      }
      titleAreaClassName = {
        styles['showcase-title-area']
      }
      metaLineClassName = {
        styles['showcase-meta-line']
      }
      categoryClassName = {
        styles['showcase-category']
      }
      actionIconClassName = {
        styles['action-icon']
      }
      headerActionsClassName = {
        styles['showcase-header-actions']
      }
      copyBtnClassName = {
        styles['copy-btn']
      }
      closeBtnClassName = {
        styles['close-btn']
      }
      bodyClassName = {
        styles['showcase-body']
      }
      gridClassName = {
        styles['showcase-grid']
      }
      infoColClassName = {
        styles['info-col']
      }
      actionColClassName = {
        styles['action-col']
      }
      descriptionBoxClassName = {
        styles['description-box']
      }
      emptyDescriptionClassName = {
        styles['description-box-empty']
      }
      sectionTitleClassName = {
        styles['section-title']
      }
      descriptionTextClassName = {
        styles['description-text']
      }
      priceContainerClassName = {
        styles['price-container']
      }
      priceLabelClassName = {
        styles['price-label']
      }
      priceValueClassName = {
        styles['price-value']
      }
      fundingSectionClassName = {
        styles['funding-section']
      }
      fundingHeaderClassName = {
        styles['funding-header']
      }
      progressBarBgClassName = {
        styles['progress-bar-bg']
      }
      progressBarFillClassName = {
        styles['progress-bar-fill']
      }
      linksSectionClassName = {
        styles['links-section']
      }
      actionsAreaClassName = {
        styles['actions-area']
      }
    />
  );
};
