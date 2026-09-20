import React from 'react';
import { Track } from './components/track/track.component';
import type { Props } from './interfaces/props.interface';
import styles from './timeline.module.css';

export const TimelineTemplate: React.FC<Props> = ({
  steps,
  streams = [],
  streamsCaption = null,
  className,
}) => {
  if (steps.length === 0) return null;

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <Track
        steps = {
          steps
        }
        streams = {
          streams
        }
        streamsCaption = {
          streamsCaption
        }
      />
    </div>
  );
};
