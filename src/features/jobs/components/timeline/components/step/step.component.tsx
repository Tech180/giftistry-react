import React from 'react';
import {
  LABEL_TONE_CLASS,
  METRIC_TONE_CLASS,
} from './constants/tone-class.constant';
import type { Props } from './interfaces/props.interface';
import { StepTemplate } from './step.html';
import styles from './step.module.css';

export const Step: React.FC<Props> = ({
  step,
  isLast,
  filledConnector,
  activeConnector,
}) => {
  const labelClassName = [styles.label, LABEL_TONE_CLASS[step.tone]]
    .filter(Boolean)
    .join(' ');
  const metricClassName = [styles.metric, METRIC_TONE_CLASS[step.tone]]
    .filter(Boolean)
    .join(' ');

  return (
    <StepTemplate
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
      stepClassName = {
        styles.step
      }
      railClassName = {
        styles.rail
      }
      copyClassName = {
        styles.copy
      }
      labelClassName = {
        labelClassName
      }
      metricClassName = {
        metricClassName
      }
    />
  );
};
