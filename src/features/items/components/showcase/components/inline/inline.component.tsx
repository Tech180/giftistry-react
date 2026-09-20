import React from 'react';
import type { Props } from './interfaces/props.interface';
import { InlineTemplate } from './inline.html';
import styles from '../../showcase.module.css';

export const Inline: React.FC<Props> = (props) => {
  return (
    <InlineTemplate
      {...props}
      statusBadgeClassName = {
        styles['status-badge']
      }
      heroMetaClassName = {
        styles['detail-hero-meta']
      }
      starClassName = {
        styles['detail-star-icon']
      }
      heroClassName = {
        styles['detail-hero']
      }
      priceRowClassName = {
        styles['detail-price-row']
      }
      priceClassName = {
        styles['detail-price']
      }
      bodyClassName = {
        styles['inspector-body']
      }
      sectionClassName = {
        styles['detail-section']
      }
      sectionLabelClassName = {
        styles['section-label']
      }
      propertyGridClassName = {
        styles['property-grid']
      }
      propCardClassName = {
        styles['prop-card']
      }
      propLabelClassName = {
        styles['prop-label']
      }
      propValueClassName = {
        styles['prop-value']
      }
      detailTextClassName = {
        styles['detail-text']
      }
      emptyDescriptionClassName = {
        styles['description-box-empty']
      }
      priorityClassName = {
        styles['prop-card-priority']
      }
    />
  );
};
