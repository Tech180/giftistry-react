import React from 'react';
import type { NodeProps } from './interfaces/node-props.interface';
import { NodeTemplate } from './node.html';

export const Node: React.FC<NodeProps> = (props) => {
  return <NodeTemplate {...props} />;
};
