import React from 'react';
import type { Props } from './interfaces/props.interface';
import { PanelTemplate } from './panel.html';
import { counterFromCaption } from './utils/counter-from-caption.util';
import styles from './panel.module.css';

export const Panel: React.FC<Props> = ({ streams, caption = null }) => {
  if (streams.length === 0) return null;

  return (
    <PanelTemplate
      streams = {
        streams
      }
      counter = {
        counterFromCaption(caption, streams.length)
      }
      panelClassName = {
        styles.panel
      }
      headerClassName = {
        styles.header
      }
      headerRowClassName = {
        styles.headerRow
      }
      titleClassName = {
        styles.title
      }
      counterClassName = {
        styles.counter
      }
      listClassName = {
        styles.list
      }
    />
  );
};
