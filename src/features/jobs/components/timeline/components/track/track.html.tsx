import React from 'react';
import { Step } from '../step/step.component';
import { Panel } from '../stream/panel/panel.component';
import type { TrackProps } from './interfaces/track-props.interface';
import styles from './track.module.css';

export const TrackTemplate: React.FC<TrackProps> = ({
  steps,
  streams = [],
  streamsCaption = null,
}) => {
  if (steps.length === 0) return null;

  const showStreams =
    streams.length > 0 && steps.some((step) => step.id === 'grabInfo');

  return (
    <div className={styles.host}>
      <ol
        className={styles.track}
        style={{ ['--timeline-cols' as string]: String(steps.length) }}
        aria-label="Import steps"
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const filledConnector = step.tone === 'done';
          const activeConnector = step.tone === 'active';

          return (
            <Step
              key={step.id}
              step={step}
              isLast={isLast}
              filledConnector={filledConnector}
              activeConnector={activeConnector}
            />
          );
        })}
      </ol>
      {showStreams ? (
        <div className={styles.streams}>
          <Panel streams={streams} caption={streamsCaption} />
        </div>
      ) : null}
    </div>
  );
};
