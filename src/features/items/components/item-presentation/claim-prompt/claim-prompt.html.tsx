import React from 'react';
import { ClaimAnonymousToggle } from '../claim-anonymous-toggle/claim-anonymous-toggle.html';
import { ClaimPromptProps } from './interfaces/claim-prompt-props.interface';
import styles from './claim-prompt.module.css';

export const ClaimPrompt: React.FC<ClaimPromptProps> = ({
  anonymous,
  onAnonymousChange,
  prompt = 'Claim this item?',
}) => (
  <div className={styles['claim-prompt-block']}>
    <span className={styles['claim-prompt-text']}>{prompt}</span>
    <ClaimAnonymousToggle checked={anonymous} onChange={onAnonymousChange} />
  </div>
);
