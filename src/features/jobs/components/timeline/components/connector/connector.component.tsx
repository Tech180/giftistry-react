import React from 'react';
import type { ConnectorProps } from './interfaces/connector-props.interface';
import { ConnectorTemplate } from './connector.html';

export const Connector: React.FC<ConnectorProps> = (props) => {
  return <ConnectorTemplate {...props} />;
};
