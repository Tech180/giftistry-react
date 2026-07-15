import React from 'react';
import type { JobImportTimelineProps } from './interfaces/job-import-timeline-props.interface';
import styles from './job-import-timeline.module.css';

const toneClass: Record<string, string> = {
  pending: styles.timelinePending,
  active: styles.timelineActive,
  done: styles.timelineDone,
  error: styles.timelineError,
};

export const JobImportTimeline: React.FC<JobImportTimelineProps> = ({
  steps,
  streams = [],
  streamsCaption = null,
  className,
}) => {
  if (steps.length === 0) return null;

  const showStreams = streams.length > 0;

  return (
    <div className={className}>
      <ol
        className={styles.timeline}
        style={{ ['--timeline-cols' as string]: String(steps.length) }}
        aria-label="Import steps"
      >
        {steps.map((step, index) => {
          const isGrabWithStreams = step.id === 'grabInfo' && showStreams;

          return (
            <li
              key={step.id}
              className={[
                styles.timelineItem,
                toneClass[step.tone] || '',
                isGrabWithStreams ? styles.timelineItemBranch : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className={styles.timelineNode} aria-hidden>
                <span className={styles.timelineDot} />
                {index < steps.length - 1 ? (
                  <span className={styles.timelineConnector} />
                ) : null}
              </span>
              <span className={styles.timelineLabel}>{step.label}</span>

              {isGrabWithStreams ? (
                <div className={styles.nestedBranch}>
                  <span className={styles.branchStem} aria-hidden />
                  {streamsCaption ? (
                    <p className={styles.streamsCaption}>{streamsCaption}</p>
                  ) : null}
                  <ol className={styles.nestedStreams} aria-label="Active grab streams">
                    {streams.map((stream, streamIndex) => (
                      <li
                        key={stream.id}
                        className={[styles.streamItem, toneClass[stream.tone] || '']
                          .filter(Boolean)
                          .join(' ')}
                        title={stream.label}
                      >
                        <span className={styles.streamNode} aria-hidden>
                          <span className={styles.streamDot} />
                          {streamIndex < streams.length - 1 ? (
                            <span className={styles.streamConnector} />
                          ) : null}
                        </span>
                        <span className={styles.streamLabel}>{stream.label}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
