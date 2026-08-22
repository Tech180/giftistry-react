import React from 'react';
import { Plus } from 'lucide-react';
import type { PromptTokensListTemplateProps } from './interfaces/prompt-tokens-list-template-props.interface';
import styles from './prompt-tokens-list.module.css';

export const PromptTokensListTemplate: React.FC<PromptTokensListTemplateProps> = ({
  rows,
  onInsertToken,
}) => {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className={styles['tokens-section']}>
      <div className={styles['tokens-header']}>Available Tokens</div>
      <div className={styles['tokens-list']} role="list">
        {rows.map((row) => (
          <button
            key={row.token}
            type="button"
            className={styles['token-list-item']}
            role="listitem"
            title={row.insertTitle}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={() => onInsertToken(row.token)}
          >
            <div className={styles['token-item-header']}>
              <span className={styles['token-name']}>
                <code className={styles['token-name-code']}>{row.token}</code>
              </span>
              <Plus className={styles['token-insert-icon']} aria-hidden="true" strokeWidth={2.5} />
            </div>
            <span className={styles['token-desc']}>{row.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptTokensListTemplate;
