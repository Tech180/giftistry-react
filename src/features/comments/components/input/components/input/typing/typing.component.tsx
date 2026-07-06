import React from 'react';
import { TypingProps } from './interfaces/typing-props.interface';
import { TypingTemplate } from './typing.html';

export const TypingIndicator: React.FC<TypingProps> = (props) => (
  <TypingTemplate {...props} />
);
