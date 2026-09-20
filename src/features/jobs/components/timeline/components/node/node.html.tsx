import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const NodeTemplate: React.FC<TemplateProps> = ({
  nodeClassName,
  innerClassName,
  checkClassName,
}) => {
  return (
    <span className={nodeClassName} aria-hidden>
      <span className={innerClassName} />
      <svg
        className={checkClassName}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
};
