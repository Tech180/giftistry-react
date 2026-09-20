import React from 'react';
import { Step } from '../step/step.component';
import { Panel } from '../stream/panel/panel.component';
import type { TemplateProps } from './interfaces/template-props.interface';

export const TrackTemplate: React.FC<TemplateProps> = ({
  stepRows,
  showStreams,
  streams,
  streamsCaption,
  trackCols,
  hostClassName,
  trackClassName,
  streamsClassName,
}) => {
  return (
    <div className={hostClassName}>
      <ol
        className={trackClassName}
        style={{ ['--timeline-cols' as string]: trackCols }}
        aria-label="Import steps"
      >
        {stepRows.map(({ step, isLast, filledConnector, activeConnector }) => (
          <Step
            key={step.id}
            step = {
              step
            }
            isLast = {
              isLast
            }
            filledConnector = {
              filledConnector
            }
            activeConnector = {
              activeConnector
            }
          />
        ))}
      </ol>
      {showStreams ? (
        <div className={streamsClassName}>
          <Panel
            streams = {
              streams
            }
            caption = {
              streamsCaption
            }
          />
        </div>
      ) : null}
    </div>
  );
};
