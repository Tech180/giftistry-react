import React from 'react';
import type { Props } from './interfaces/props.interface';
import { PhotoTemplate } from './photo.html';
import styles from '../../showcase.module.css';

export const Photo: React.FC<Props> = ({ imageUrl }) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <PhotoTemplate
      imageUrl = {
        imageUrl
      }
      rootClassName = {
        styles['detail-photo']
      }
      imageClassName = {
        styles['detail-photo-img']
      }
    />
  );
};
