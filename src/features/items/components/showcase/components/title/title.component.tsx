import React from 'react';
import type { Props } from './interfaces/props.interface';
import { TitleTemplate } from './title.html';
import styles from '../../showcase.module.css';

export const Title: React.FC<Props> = ({
  variant,
  name,
  isLinkedToItems,
  isRelatedToItems,
  substitutionKind,
  substitutionCreatedByUserId,
}) => {
  return (
    <TitleTemplate
      variant = {
        variant
      }
      name = {
        name
      }
      isLinkedToItems = {
        isLinkedToItems
      }
      isRelatedToItems = {
        isRelatedToItems
      }
      showSubstitutionBadge = {
        substitutionKind !== 'original'
      }
      substitutionKind = {
        substitutionKind
      }
      substitutionCreatedByUserId = {
        substitutionCreatedByUserId
      }
      titleClassName = {
        variant === 'inline' ? styles['detail-title'] : styles['showcase-title']
      }
      linkedIconClassName = {
        styles['linked-item-icon']
      }
    />
  );
};
