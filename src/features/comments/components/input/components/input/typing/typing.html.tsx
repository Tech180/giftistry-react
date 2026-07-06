import React from 'react';
import { TypingTemplateProps } from './interfaces/typing-template-props.interface';
import styles from './typing.module.css';

export const TypingTemplate: React.FC<TypingTemplateProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  return (
    <div className={styles.indicator}>
      <div className={styles.bouncer}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <span>
        <strong>{typingUsers.join(', ')}</strong> {typingUsers.length === 1 ? 'is' : 'are'} typing...
      </span>
    </div>
  );
};
