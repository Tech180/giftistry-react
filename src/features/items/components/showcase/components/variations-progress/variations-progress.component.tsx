import React from 'react';
import type { Props } from './interfaces/props.interface';
import { VariationsProgressTemplate } from './variations-progress.html';
import styles from '../../showcase.module.css';

export const VariationsProgress: React.FC<Props> = ({
  variations,
  sectionTitle,
  sectionVariant,
}) => {
  if (variations.length === 0) {
    return null;
  }

  return (
    <VariationsProgressTemplate
      variations = {
        variations
      }
      sectionTitle = {
        sectionTitle
      }
      sectionVariant = {
        sectionVariant
      }
      sectionClassName = {
        sectionVariant === 'inline' ? styles['detail-section'] : styles['variations-section']
      }
      labelClassName = {
        sectionVariant === 'inline' ? styles['section-label'] : styles['section-title']
      }
      listClassName = {
        styles['variations-progress-list']
      }
      cardClassName = {
        styles['variation-progress-card']
      }
      headerClassName = {
        styles['variation-progress-header']
      }
      nameClassName = {
        styles['variation-name']
      }
      qtyClassName = {
        styles['variation-qty']
      }
      barBgClassName = {
        styles['progress-bar-bg-mini']
      }
      barFillClassName = {
        styles['progress-bar-fill-mini']
      }
    />
  );
};
