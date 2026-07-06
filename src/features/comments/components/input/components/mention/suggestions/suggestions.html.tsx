import React from 'react';
import { SuggestionsTemplateProps } from './interfaces/suggestions-template-props.interface';
import styles from './suggestions.module.css';

export const SuggestionsTemplate: React.FC<SuggestionsTemplateProps> = ({
  candidates,
  activeIndex,
  onHover,
  onSelect,
}) => (
  <ul className={styles.list} role="listbox" aria-label="Mention suggestions">
    {candidates.map((participant, index) => (
      <li key={participant.userId} role="option" aria-selected={index === activeIndex}>
        <button
          type="button"
          className={`${styles.option} ${index === activeIndex ? styles['option-active'] : ''}`}
          onMouseEnter={() => onHover(index)}
          onClick={() => onSelect(index)}
        >
          <div className={styles['option-info']}>
            <span className={styles.username}>@{participant.username}</span>
            <span className={styles.name}>{participant.displayName}</span>
          </div>
        </button>
      </li>
    ))}
  </ul>
);
