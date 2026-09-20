import React from 'react';
import type { Props } from './interfaces/props.interface';
import { MetaBadgesTemplate } from './meta-badges.html';
import styles from '../../showcase.module.css';

export const MetaBadges: React.FC<Props> = ({ entries, sectionTitle, sectionVariant }) => {
  if (entries.length === 0) {
    return null;
  }

  return (
    <MetaBadgesTemplate
      entries = {
        entries
      }
      sectionTitle = {
        sectionTitle
      }
      sectionVariant = {
        sectionVariant
      }
      sectionClassName = {
        sectionVariant === 'inline' ? styles['detail-section'] : styles['meta-section']
      }
      labelClassName = {
        sectionVariant === 'inline' ? styles['section-label'] : styles['section-title']
      }
      listClassName = {
        styles['meta-badges']
      }
      badgeClassName = {
        styles['meta-badge']
      }
    />
  );
};
