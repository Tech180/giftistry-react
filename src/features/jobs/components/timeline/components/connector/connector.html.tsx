import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ConnectorTemplate: React.FC<TemplateProps> = ({
  connectorDesktopClassName,
  connectorMobileClassName,
  fillClassName,
  fillMobileClassName,
}) => {
  return (
    <>
      <span className={connectorDesktopClassName} aria-hidden>
        <span className={fillClassName} />
      </span>
      <span className={connectorMobileClassName} aria-hidden>
        <span className={fillMobileClassName} />
      </span>
    </>
  );
};
