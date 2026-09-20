import React from 'react';
import { DOT_TONE_CLASS, STATUS_TONE_CLASS } from './constants/tone-class.constant';
import type { Props } from './interfaces/props.interface';
import { RowTemplate } from './row.html';
import { statusText } from './utils/status-text.util';
import styles from './row.module.css';

export const Row: React.FC<Props> = ({ lane }) => {
  const caption = lane.caption || lane.label;
  const isActive = lane.tone === 'active';
  const dotClassName = [styles.dot, DOT_TONE_CLASS[lane.tone]].filter(Boolean).join(' ');
  const statusClassName = [styles.status, STATUS_TONE_CLASS[lane.tone]]
    .filter(Boolean)
    .join(' ');

  return (
    <RowTemplate
      lane = {
        lane
      }
      caption = {
        caption
      }
      isActive = {
        isActive
      }
      statusLabel = {
        statusText(lane)
      }
      rowClassName = {
        styles.row
      }
      topClassName = {
        styles.top
      }
      identityClassName = {
        styles.identity
      }
      iconClassName = {
        styles.icon
      }
      spinnerClassName = {
        styles.spinner
      }
      dotClassName = {
        dotClassName
      }
      nameClassName = {
        styles.name
      }
      statusClassName = {
        statusClassName
      }
    />
  );
};
