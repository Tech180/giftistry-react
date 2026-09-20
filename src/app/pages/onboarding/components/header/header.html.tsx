import React from 'react';
import { Gift } from 'lucide-react';
import type { HeaderTemplateProps } from './interfaces/header-template-props.interface';
import styles from './header.module.css';

export const HeaderTemplate: React.FC<HeaderTemplateProps> = ({
  step,
  totalSteps,
  visibleStepId,
  title,
  subtitle,
}) => {
  const isHello = visibleStepId === 'hello';

  return (
    <header className={styles['header']}>
      <div className={styles['header__mobile-progress']} aria-hidden="true">
        {Array.from({ length: Math.max(totalSteps - 1, 1) }).map((_, index) => (
          <div
            key={index}
            className={[
              styles['header__mobile-dot'],
              index <= Math.min(step, totalSteps - 2)
                ? styles['header__mobile-dot--active']
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </div>
      <div
        className={[
          styles['header__row'],
          isHello ? styles['header__row--hello'] : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={styles['header__copy']}>
          <h1
            className={[
              styles['header__title'],
              isHello ? styles['header__title--hello'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {title}
          </h1>
          <p
            className={[
              styles['header__subtitle'],
              isHello ? styles['header__subtitle--hello'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {subtitle}
          </p>
        </div>
        {isHello ? (
          <div className={styles['header__hello-mark']} aria-hidden="true">
            <Gift size={56} strokeWidth={1.25} />
          </div>
        ) : null}
      </div>
    </header>
  );
};
