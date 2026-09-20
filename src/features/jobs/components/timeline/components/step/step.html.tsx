import React from 'react';
import { Node } from '../node/node.component';
import { Connector } from '../connector/connector.component';
import type { TemplateProps } from './interfaces/template-props.interface';

export const StepTemplate: React.FC<TemplateProps> = ({
  step,
  isLast,
  filledConnector,
  activeConnector,
  stepClassName,
  railClassName,
  copyClassName,
  labelClassName,
  metricClassName,
}) => {
  return (
    <li className={stepClassName}>
      <div className={railClassName}>
        <Node
          tone = {
            step.tone
          }
        />
        <Connector
          filled = {
            filledConnector
          }
          active = {
            activeConnector
          }
          isLast = {
            isLast
          }
        />
      </div>
      <div className={copyClassName}>
        <span className={labelClassName}>{step.label}</span>
        {step.metric ? <span className={metricClassName}>{step.metric}</span> : null}
      </div>
    </li>
  );
};
