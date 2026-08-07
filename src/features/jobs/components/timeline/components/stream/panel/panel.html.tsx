import React from 'react';
import { Row } from '../row/row.component';
import type { PanelProps } from './interfaces/panel-props.interface';
import styles from './panel.module.css';

function counterFromCaption(caption: string | null | undefined, count: number): string {
  if (!caption) return String(count);
  const match = caption.match(/(\d+\s*\/\s*\d+|\d+)/);
  return match?.[1]?.replace(/\s/g, '') ?? String(count);
}

export const PanelTemplate: React.FC<PanelProps> = ({ streams, caption = null }) => {
  if (streams.length === 0) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <span className={styles.title}>Active Streams</span>
          <span className={styles.counter}>{counterFromCaption(caption, streams.length)}</span>
        </div>
      </div>
      <ol className={styles.list} aria-label="Active grab streams">
        {streams.map((lane) => (
          <Row key={lane.id} lane={lane} />
        ))}
      </ol>
    </div>
  );
};
