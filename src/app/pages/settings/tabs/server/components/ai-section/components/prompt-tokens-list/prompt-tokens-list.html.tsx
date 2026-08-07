import React from 'react';
import { Plus } from 'lucide-react';
import { getPromptTokenDescription } from '../../utils/prompt-token-info.util';
import { PromptTokensListProps } from './interfaces/prompt-tokens-list-props.interface';
import styles from './prompt-tokens-list.module.css';

export const PromptTokensListTemplate: React.FC<PromptTokensListProps> = ({
  tokens,
  onInsertToken,
}) => {
  if (tokens.length === 0) {
    return null;
  }

  return (
    <div className={styles['tokens-section']}>
      <div className={styles['tokens-header']}>
        <span>Tokens</span>
        <span className={styles['tokens-hint']}>Click to insert</span>
      </div>
      <div className={styles['tokens-list']} role="list">
        {tokens.map((token) => (
          <button
            key={token}
            type="button"
            className={styles['token-list-item']}
            role="listitem"
            title={`Insert ${token} at cursor`}
            onMouseDown={(event) => {
              // Keep editor selection; avoid stealing focus before insert.
              event.preventDefault();
            }}
            onClick={() => onInsertToken(token)}
          >
            <div className={styles['token-item-header']}>
              <span className={styles['token-name']}>
                <code>{token}</code>
              </span>
              <Plus className={styles['token-insert-icon']} aria-hidden="true" strokeWidth={2.5} />
            </div>
            <span className={styles['token-desc']}>{getPromptTokenDescription(token)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptTokensListTemplate;
