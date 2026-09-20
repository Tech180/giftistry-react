import React from 'react';
import { Button } from 'shared/ui';
import { Timeline } from '../timeline/timeline.component';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ProgressBoxTemplate: React.FC<TemplateProps> = ({
  title,
  message,
  error,
  isActive,
  isCancelling,
  onCancel,
  steps,
  streams,
  streamsCaption,
  rootClassName,
  headerClassName,
  titleClassName,
  messageClassName,
  errorClassName,
}) => {
  return (
    <section className={rootClassName} aria-label="Import progress">
      <div className={headerClassName}>
        <h3 className={titleClassName}>{title}</h3>
        {isActive ? (
          <Button
            type = {
              'button'
            }
            variant = {
              'secondary'
            }
            size = {
              'sm'
            }
            onClick = {
              onCancel
            }
            disabled = {
              isCancelling
            }
          >
            Cancel
          </Button>
        ) : null}
      </div>
      <p className={messageClassName}>{message}</p>
      <Timeline
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
      {error ? <p className={errorClassName}>{error}</p> : null}
    </section>
  );
};
