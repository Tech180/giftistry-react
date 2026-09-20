import React from 'react';
import type { Props } from './interfaces/props.interface';
import type { TrackStepRow } from './interfaces/template-props.interface';
import { TrackTemplate } from './track.html';
import styles from './track.module.css';

export const Track: React.FC<Props> = ({
  steps,
  streams = [],
  streamsCaption = null,
}) => {
  if (steps.length === 0) return null;

  const stepRows: TrackStepRow[] = steps.map((step, index) => ({
    step,
    isLast: index === steps.length - 1,
    filledConnector: step.tone === 'done',
    activeConnector: step.tone === 'active',
  }));

  const showStreams =
    streams.length > 0 && steps.some((step) => step.id === 'grabInfo');

  return (
    <TrackTemplate
      stepRows = {
        stepRows
      }
      showStreams = {
        showStreams
      }
      streams = {
        streams
      }
      streamsCaption = {
        streamsCaption
      }
      trackCols = {
        String(steps.length)
      }
      hostClassName = {
        styles.host
      }
      trackClassName = {
        styles.track
      }
      streamsClassName = {
        styles.streams
      }
    />
  );
};
