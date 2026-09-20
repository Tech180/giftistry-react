import React from 'react';
import { StaggerItem } from '../../step-panel/stagger-item.component';
import type { DoneTemplateProps } from './interfaces/done-template-props.interface';
import styles from './done.module.css';

export const DoneTemplate: React.FC<DoneTemplateProps> = () => (
  <div className={styles['done']}>
    <StaggerItem>
      <div className={styles['done__copy']}>
        <h2 className={styles['done__title']}>Enjoy Giftistry</h2>
        <p className={styles['done__body']}>
          Your preferences are saved. Jump in, create a wishlist, and invite the people you
          celebrate with.
        </p>
      </div>
    </StaggerItem>
    <StaggerItem>
      <div className={styles['done__icon']} aria-hidden="true">
        <div className={styles['done__icon-inner']}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              className={styles['done__check-path']}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
    </StaggerItem>
  </div>
);
