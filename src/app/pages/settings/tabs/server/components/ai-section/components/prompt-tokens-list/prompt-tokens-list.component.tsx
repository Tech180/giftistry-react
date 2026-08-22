import React from 'react';
import { getPromptTokenDescription } from '../../utils/prompt-token-info.util';
import type { PromptTokensListProps } from './interfaces/prompt-tokens-list-props.interface';
import { PromptTokensListTemplate } from './prompt-tokens-list.html';

export const PromptTokensList: React.FC<PromptTokensListProps> = ({ tokens, onInsertToken }) => {
  const rows = tokens.map((token) => ({
    token,
    description: getPromptTokenDescription(token),
    insertTitle: `Insert ${token} at cursor`,
  }));

  return <PromptTokensListTemplate rows={rows} onInsertToken={onInsertToken} />;
};

export default PromptTokensList;
