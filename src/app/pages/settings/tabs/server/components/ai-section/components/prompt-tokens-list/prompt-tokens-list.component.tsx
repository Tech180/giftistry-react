import React from 'react';
import { PromptTokensListProps } from './interfaces/prompt-tokens-list-props.interface';
import { PromptTokensListTemplate } from './prompt-tokens-list.html';

export const PromptTokensList: React.FC<PromptTokensListProps> = (props) => {
  return <PromptTokensListTemplate {...props} />;
};

export default PromptTokensList;
