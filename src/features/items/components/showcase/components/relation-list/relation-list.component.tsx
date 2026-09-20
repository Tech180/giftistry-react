import React from 'react';
import type { Props } from './interfaces/props.interface';
import { RelationListTemplate } from './relation-list.html';
import styles from '../../showcase.module.css';

export const RelationList: React.FC<Props> = ({ title, items }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <RelationListTemplate
      title = {
        title
      }
      items = {
        items
      }
      sectionClassName = {
        styles['detail-section']
      }
      labelClassName = {
        styles['section-label']
      }
      listClassName = {
        styles['relation-list']
      }
      itemClassName = {
        styles['relation-list-item']
      }
      statusClassName = {
        styles['relation-list-status']
      }
    />
  );
};
