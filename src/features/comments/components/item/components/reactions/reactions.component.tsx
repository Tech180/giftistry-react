import React from 'react';
import { ReactionsProps } from './interfaces/reactions-props.interface';
import { ReactionsTemplate } from './reactions.html';

export const Reactions: React.FC<ReactionsProps> = (props) => {
  return <ReactionsTemplate {...props} />;
};
