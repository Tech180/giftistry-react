import React from 'react';
import { Palette, Settings2, UserRound } from 'lucide-react';
import { StaggerItem } from '../../step-panel/stagger-item.component';
import type { HelloTemplateProps } from './interfaces/hello-template-props.interface';
import styles from './hello.module.css';

export const HelloTemplate: React.FC<HelloTemplateProps> = ({ requiresOwner }) => (
  <div className={styles['hello']}>
    <StaggerItem>
      <p className={styles['hello__lead']}>
        Giftistry helps you share wishlists with the people who matter — no awkward guessing, just
        clear lists and happy surprises.
      </p>
    </StaggerItem>

    <StaggerItem>
      <ul className={styles['hello__points']}>
        <li className={styles['hello__point']}>
          <span className={styles['hello__point-icon']} aria-hidden="true">
            <Palette size={16} />
          </span>
          <span>Choose a look that fits your style</span>
        </li>
        <li className={styles['hello__point']}>
          <span className={styles['hello__point-icon']} aria-hidden="true">
            <UserRound size={16} />
          </span>
          <span>Add your name so friends recognize you</span>
        </li>
        {requiresOwner ? (
          <li className={styles['hello__point']}>
            <span className={styles['hello__point-icon']} aria-hidden="true">
              <Settings2 size={16} />
            </span>
            <span>As the owner, finish a few server settings</span>
          </li>
        ) : null}
      </ul>
    </StaggerItem>

    <StaggerItem>
      <p className={styles['hello__aside']}>
        {requiresOwner
          ? 'You can skip optional steps and tweak anything later in Settings.'
          : 'Optional steps can be skipped — you can always change things later.'}
      </p>
    </StaggerItem>
  </div>
);
