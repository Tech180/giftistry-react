import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const RowTemplate: React.FC<TemplateProps> = ({
  caption,
  isActive,
  statusLabel,
  rowClassName,
  topClassName,
  identityClassName,
  iconClassName,
  spinnerClassName,
  dotClassName,
  nameClassName,
  statusClassName,
  lane,
}) => {
  return (
    <li className={rowClassName} title={caption}>
      <div className={topClassName}>
        <div className={identityClassName}>
          <span className={iconClassName} aria-hidden>
            {isActive ? (
              <svg
                className={spinnerClassName}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <span className={dotClassName} />
            )}
          </span>
          <span className={nameClassName}>{lane.label}</span>
        </div>
        <span className={statusClassName}>{statusLabel}</span>
      </div>
    </li>
  );
};
