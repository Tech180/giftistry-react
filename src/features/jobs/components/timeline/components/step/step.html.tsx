import React from 'react';
import { Node } from '../node/node.component';
import { Connector } from '../connector/connector.component';
import type { StepProps } from './interfaces/step-props.interface';
import styles from './step.module.css';

// CSS modules do not export nested compound selectors as separate keys.
// tone modifiers are applied via className strings matching the CSS file classes.
const toneClass = {
  pending: styles['step--pending'] ?? '',
  active: styles['step--active'] ?? '',
  done: styles['step--done'] ?? '',
  error: styles['step--error'] ?? '',
};

export const StepTemplate: React.FC<StepProps> = ({
  step,
  isLast,
  filledConnector,
  activeConnector,
}) => {
  return (
    <li
      className={[styles.step, toneClass[step.tone] || ''].filter(Boolean).join(' ')}
    >
      <div className={styles.rail}>
        <Node tone={step.tone} />
        <Connector
          filled={filledConnector}
          active={activeConnector}
          isLast={isLast}
        />
      </div>
      <div className={styles.copy}>
        <span className={styles.label}>{step.label}</span>
        {step.metric ? <span className={styles.metric}>{step.metric}</span> : null}
      </div>
    </li>
  );
};
